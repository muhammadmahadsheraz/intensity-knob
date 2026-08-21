import Schedule from "../models/Schedule";
import {ISchedule,IEntry} from "../models/Schedule";
import Meeting from "../models/Meetings"
import Availability from "../models/Availability"
import {Day} from "../models/Availability"
import {intensityValues,Intensity,days} from "../constants"



//Schedule Services hooked to its services controller

export const createScheduleService = async (userId: string,intensity: Intensity,skipDays:Day[] =[]) => {
    const entries: IEntry[] = [];
    const settings = intensityValues[intensity].value;
    await Meeting.updateMany({ userId, status: "scheduled" },{ $set: { status: "pending" } });
    const meetings = await Meeting.find({userId,status: {$nin: ["completed", "cancelled", "scheduled"]}}).sort({ deadline: 1 });
    const availability = await Availability.findOne({userId});

    if (!availability) return null;
    if (meetings.length === 0) return null;

    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    let currentDate = new Date(now);
    let daynum = now.getDay();
    let meetingIndex = 0;
    const startDate = new Date(now);

    for ( let j = 0; j < settings.cycleLength && meetingIndex < meetings.length;) {
        let day: Day = days[daynum];
        while(skipDays.includes(day)){
            currentDate.setDate(currentDate.getDate()+1)
            daynum= (daynum +1)%7;
            day = days[daynum];
        }
        const slots = availability[day];

        if (slots.length > 0) {
            const slot = slots[0];
            const start = timeToMinutes(slot.start);
            const end = timeToMinutes(slot.end);
            let currentTime = start;

            if (j === 0 && currentTimeMinutes > start) {
                currentTime = currentTimeMinutes;
            }

            if (currentTime < end && start < end) {
                const availableMinutes = end - currentTime;
                const timeDiv = j === 0 && currentTimeMinutes > start
                        ? settings.meetingDuration + settings.break : availableMinutes / settings.meetingsPerDay;

                for (let i = 0; i < settings.meetingsPerDay && meetingIndex < meetings.length; i++) {
                    entries.push({
                        meetingId: meetings[meetingIndex]._id,
                        date: new Date(currentDate),
                        start: minutesToTime(Math.floor(currentTime)),
                        sequence: j,
                        status: "scheduled"
                    });
                    meetingIndex++;
                    currentTime += timeDiv;
                }
            }
        }
        j++
        currentDate.setDate(currentDate.getDate() + 1);
        daynum = (daynum + 1) % 7;
    }

    if (entries.length === 0) return null;

    const scheduledMeetingIds = entries.map(e => e.meetingId);
    await Meeting.updateMany(
        { _id: { $in: scheduledMeetingIds } },
        { $set: { status: "scheduled" } }
    );

    await Schedule.deleteMany({ userId });

    return await Schedule.create({
        userId,
        intensity,
        startDate,
        entries
    });
};

export const getSchedulesService = async () => {
    return await Schedule.find();
}

export const getScheduleService = async (id: string) => {
    return await Schedule.findOne({userId: id});
}

export const updateScheduleService = async (id: string,data:Partial<ISchedule>) => {
    return await Schedule.findByIdAndUpdate(id,data,{new:true});
}

export const deleteScheduleService = async (id: string) => {
    return await Schedule.findByIdAndDelete(id);
}

export const completeMeetingService = async (meetingId: string, userId: string) => {
    await Meeting.findByIdAndUpdate(meetingId, { status: "completed" });

    const schedule = await Schedule.findOne({ userId });
    if (schedule) {
        const entry = schedule.entries.find(
            e => e.meetingId.toString() === meetingId
        );
        if (entry) {
            entry.status = "completed";
            await schedule.save();
        }
    }
    return schedule;
}

export const skipMeetingService = async (meetingId: string, userId: string) => {
    await Meeting.findByIdAndUpdate(meetingId, { status: "skipped" });

    const schedule = await Schedule.findOne({ userId });
    if (schedule) {
        const entry = schedule.entries.find(
            e => e.meetingId.toString() === meetingId
        );
        if (entry) {
            entry.status = "skipped";
            await schedule.save();
        }
    }
    return schedule;
}

export const rescheduleSkippedService = async (userId: string) => {
    const availability = await Availability.findOne({userId})
    const schedule = await Schedule.findOne({ userId });
    if (!schedule) return null;
    const skippedEntries = schedule.entries
        .filter(e => e.status === "skipped")
        .sort((a, b) => a.sequence - b.sequence);

    if (skippedEntries.length === 0) return schedule;

    const cycleLength = getCycleLength(schedule.intensity);
    const skipDays = schedule.skipDays || [];
    const startDate = schedule.startDate;
    
    for (const skipped of skippedEntries) {
        let targetSequence = skipped.sequence + 1;
        const today = new Date()
        today.setHours(0,0,0,0)
        while (targetSequence < cycleLength)
        {
            const getDate = getDateForSequence(startDate,targetSequence,skipDays);
            if(getDate >= today) break;
            targetSequence++;
        }
        if (targetSequence >= cycleLength) {
            skipped.status = "pending";
            await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "pending" });
            continue;
        }

        const targetEntries = schedule.entries
        .filter(e => e.sequence === targetSequence && e.status === "scheduled" && e.meetingId.toString() !== skipped.meetingId.toString())
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

        if (targetEntries.length === 0) {
            skipped.date = getDateForSequence(startDate, targetSequence, skipDays);
            skipped.sequence = targetSequence;
            skipped.start = getDayStartTime(userId, skipped.date);
            skipped.status = "scheduled";
            await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "scheduled" });
            continue;
        }

        skipped.date = new Date(targetEntries[0].date);
        skipped.start = targetEntries[0].start;
        skipped.sequence = targetSequence;
        skipped.status = "scheduled";
        await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "scheduled" });

        for (let i = 0; i < targetEntries.length - 1; i++) {
            targetEntries[i].date = new Date(targetEntries[i + 1].date);
            targetEntries[i].start = targetEntries[i + 1].start;
            targetEntries[i].sequence = targetSequence;
        }

        let displaced = targetEntries[targetEntries.length - 1];
        const maxPerDay = intensityValues[schedule.intensity].value.meetingsPerDay;

        for (let seq = targetSequence + 1; seq < cycleLength; seq++) {
            const seqEntries = schedule.entries
                .filter(e => e.sequence === seq && e.status === "scheduled" && e.meetingId.toString() !== skipped.meetingId.toString())
                .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

            const seqDate = getDateForSequence(startDate, seq, skipDays);
            const allEntries = seqEntries.length < maxPerDay
                ? seqEntries
                : seqEntries.slice(1);

            redistribute(allEntries, displaced, seqDate, seq);

            if (seqEntries.length < maxPerDay) break;

            const nextSeq = seq + 1;
            if (nextSeq >= cycleLength) {
                displaced.status = "pending";
                await Meeting.findByIdAndUpdate(displaced.meetingId, { status: "pending" });
                break;
            }

            const nextEntries = schedule.entries
                .filter(e => e.sequence === nextSeq && e.status === "scheduled" && e.meetingId.toString() !== skipped.meetingId.toString())
                .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

            if (nextEntries.length === 0) {
                const nextDate = getDateForSequence(startDate, nextSeq, skipDays);
                displaced.date = nextDate;
                displaced.start = getDayStartTime(userId, nextDate);
                displaced.sequence = nextSeq;
                break;
            }

            displaced = nextEntries[0];
        }
    }

    await schedule.save();
    return schedule;
    function redistribute(entries: any[], displaced: any, date: Date, seq: number) {
        const all = [displaced, ...entries];
        const slotStart = getDayStartTime(userId, date);
        const slotEnd = getDayEndTime(userId, date);
        const startMin = timeToMinutes(slotStart);
        const endMin = timeToMinutes(slotEnd);
        const gap = (endMin - startMin) / all.length;

        for (let i = 0; i < all.length; i++) {
            all[i].date = new Date(date);
            all[i].start = minutesToTime(Math.floor(startMin + gap * i));
            all[i].sequence = seq;
        }
    }
    function getDayStartTime(userId:string,date:Date):string{
        if (!availability) return "9:00";
        const day : Day = days[date.getDay()]
        let slots = availability[day]
        if (slots && slots.length > 0) return slots[0].start;
        return "9:00"
    }

    function getDayEndTime(userId:string,date:Date):string{
        if (!availability) return "17:00";
        const day : Day = days[date.getDay()]
        let slots = availability[day]
        if (slots && slots.length > 0) return slots[0].end;
        return "17:00"
    }
}

function getCycleLength(intensity: Intensity): number {
    return intensityValues[intensity].value.cycleLength;
}

function getDateForSequence(startDate: Date, sequence: number,skipDays : Day[]=[]): Date {
    const date = new Date(startDate);
    let added = 0;
    let safety = 0;
    while (added <= sequence && safety < 100){
        if(!skipDays.includes(days[date.getDay()])){
            if (added === sequence) break;
            added++;
        }
        date.setDate(date.getDate() + 1);
        safety++;
    }
    return date;
}

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
