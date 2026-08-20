import Schedule from "../models/Schedule";
import {ISchedule,IEntry} from "../models/Schedule";
import Meeting from "../models/Meetings"
import Availability from "../models/Availability"
import {Day} from "../models/Availability"
import {intensityValues,Intensity,days} from "../constants"

export const createScheduleService = async (userId: string,intensity: Intensity,skipDays:Day[] =[]) => {
    const entries: IEntry[] = [];
    const settings = intensityValues[intensity].value;
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
        const day: Day = days[daynum];
        if(skipDays.includes(day)){
            currentDate.setDate(currentDate.getDate()+1)
            daynum= (daynum +1)%7;
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
        const targetSequence = skipped.sequence + 1;

        if (targetSequence >= cycleLength) {
            skipped.status = "pending";
            await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "pending" });
            continue;
        }

        const targetEntries = schedule.entries
            .filter(e => e.sequence === targetSequence && e.status !== "skipped" && e._id !== skipped._id)
            .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

        if (targetEntries.length === 0) {
            skipped.date = getDateForSequence(startDate, targetSequence,skipDays);
            skipped.sequence = targetSequence;
            skipped.start = "09:00";
            skipped.status = "scheduled";
            await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "scheduled" });
            continue;
        }

        skipped.date = new Date(targetEntries[0].date);
        skipped.start = targetEntries[0].start;
        skipped.sequence = targetSequence;
        skipped.status = "scheduled";
        await Meeting.findByIdAndUpdate(skipped.meetingId, { status: "scheduled" });

        for (let i = 0; i < targetEntries.length; i++) {
            if (i < targetEntries.length - 1) {
                targetEntries[i].date = new Date(targetEntries[i + 1].date);
                targetEntries[i].start = targetEntries[i + 1].start;
            } else {
                const nextSeq = targetSequence + 1;
                const nextSequenceEntries = schedule.entries
                    .filter(e => e.sequence === nextSeq && e.status !== "skipped" && e._id !== skipped._id)
                    .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

                if (nextSeq < cycleLength && nextSequenceEntries.length > 0) {
                    targetEntries[i].date = new Date(nextSequenceEntries[0].date);
                    targetEntries[i].start = nextSequenceEntries[0].start;
                    targetEntries[i].sequence = nextSeq;
                } else if (nextSeq < cycleLength) {
                    targetEntries[i].date = getDateForSequence(startDate, nextSeq,skipDays);
                    targetEntries[i].start = "09:00";
                    targetEntries[i].sequence = nextSeq;
                } else {
                    targetEntries[i].status = "pending";
                    targetEntries[i].sequence = nextSeq;
                    await Meeting.findByIdAndUpdate(targetEntries[i].meetingId, { status: "pending" });
                }
            }
        }
    }

    await schedule.save();
    return schedule;
}

function getCycleLength(intensity: Intensity): number {
    return intensityValues[intensity].value.cycleLength;
}

function getDateForSequence(startDate: Date, sequence: number,skipDays : Day[]=[]): Date {
    const date = new Date(startDate);
    let added = 0;
    while (added < sequence){
        date.setDate(date.getDate() + 1);
        if(!skipDays.includes(days[date.getDay()])){
            added++;
        }
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
