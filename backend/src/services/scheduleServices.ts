import Schedule from "../models/Schedule";
import {ISchedule,IEntry} from "../models/Schedule";
import Meeting from "../models/Meetings"
import Availability from "../models/Availability"
import {Day} from "../models/Availability"
import {intensityValues,Intensity,days} from "../constants"



//Schedule Services hooked to its services controller
export const createScheduleService = async (userId:string,intensity:Intensity,skipDays : Day[] = []) =>{
    const entries: IEntry[] = [] 
    await Meeting.updateMany({userId,status:"scheduled"},{$set:{status:"pending"}})
    const meetings = await Meeting.find({userId,status :{$nin:["scheduled","completed","cancelled"]}}).sort({deadline:1})
    const settings = intensityValues[intensity].value
    const availability = await Availability.findOne({userId})
    if (!availability) return null;

    const now = new Date();
    const currentTimeMinutes = now.getHours()*60 + now.getMinutes()
    const currentDate = new Date(now);
    const startDate = new Date(now)
    
    let meetingIndex = 0;
    let dayNum = now.getDay();
    for (let i = 0; i < settings.cycleLength && meetingIndex < meetings.length ;){
    let day : Day = days[dayNum]
    while(skipDays.includes(day)){
        currentDate.setDate(currentDate.getDate() +1)
        dayNum = ( dayNum + 1) % 7;
        day = days[dayNum];
    }
    const slots = availability[day]
    if(slots.length > 0) {
        let slot = slots[0];
        let start = timeToMinutes(slot.start)
        let end = timeToMinutes(slot.end)
        let currentTime = start 
        if (i === 0 && currentTimeMinutes > start ){
            currentTime = currentTimeMinutes + 5;
        }
        if (currentTime < end && start < end){

            const availableMinutes = end - currentTime;
            const timeDiv = i===0 && currentTimeMinutes > start ? settings.meetingDuration+settings.break : availableMinutes / settings.meetingsPerDay 
            for (let j = 0 ; j < settings.meetingsPerDay && meetingIndex < meetings.length && currentTime < end;j++){
                entries.push({
                    date: new Date(currentDate),
                    start:minutesToTime(currentTime),
                    meetingId : meetings[meetingIndex]._id,
                    sequence:i,
                    status:"scheduled"
                })
                meetingIndex++;
                currentTime += timeDiv
                
            }
        }
    };
            i++;
            currentDate.setDate(currentDate.getDate()+1)

        
}
const meetingsMapIds = entries.map(e => e.meetingId)
await Meeting.updateMany(
    {_id:{$in:meetingsMapIds}},
    {$set:{status:"scheduled"}}
)
await Schedule.deleteMany({userId})
return await Schedule.create({
    userId,
    intensity,
    startDate,
    skipDays,
    entries
    })
}

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
export const rescheduleSkippedService = async (userId:string) =>{
    const availability = await Availability.findOne({userId})
    const schedule = await Schedule.findOne({userId})
    if(!schedule) return null;
    const skippedEntries = schedule.entries
    .filter(e => e.status === "skipped")
    .sort((a,b) =>a.sequence -b.sequence)
    if(skippedEntries.length === 0) return schedule;
    const today = new Date();
    today.setHours(0,0,0,0)
    const startDate = schedule.startDate;
    const skipDays = schedule.skipDays || [];
    const cycleLength = intensityValues[schedule.intensity].value.cycleLength;
    
    for (const skipped of skippedEntries){
        let targetSequence = skipped.sequence + 1;
        while(targetSequence < cycleLength){

            const getDay = getDateForSequence(startDate,targetSequence,skipDays)
            if (getDay >= today) break;
            targetSequence++;

        }
        if(targetSequence >= cycleLength){
            skipped.status = "pending"
            await Meeting.updateOne(skipped.meetingId,{status:"pending"})
            continue;
        }
        const targetEntries = schedule.entries.filter(e => e.sequence === targetSequence && e.status === "scheduled" && e.meetingId.toString() !== skipped.meetingId.toString() )
        .sort((a,b)=> timeToMinutes(a.start)-timeToMinutes(b.start))

        if(targetEntries.length === 0){

            skipped.date = getDateForSequence(startDate,targetSequence,skipDays),
            skipped.sequence = targetSequence;
            skipped.start = getDayStartTime(userId,skipped.date)
            skipped.status = "scheduled"
            await Meeting.updateOne(skipped.meetingId,{status:"scheduled"})
            continue;
            
        }
            skipped.date = targetEntries[0].date,
            skipped.sequence = targetEntries[0].sequence;
            skipped.start = targetEntries[0].start
            skipped.status = "scheduled"
            await Meeting.updateOne(skipped.meetingId,{status:"scheduled"})
            for (let i = 0 ; i < targetEntries.length -1; i++){
                targetEntries[i].start = targetEntries[i+1].start
                targetEntries[i].date = new Date (targetEntries[i+1].date);
                targetEntries[i].sequence = targetSequence;
            }
            let displaced = targetEntries[targetEntries.length - 1 ]
            if(targetSequence +1 >= cycleLength){
                
                displaced.status = "pending"
                await Meeting.updateOne(displaced.meetingId,{status:"pending"})
                continue;

            }
            for (let seq =  targetSequence + 1; seq < cycleLength; seq++){
                let dominoCurrentEntries = schedule.entries.filter(e => e.sequence === seq && e.status === "scheduled" && e.meetingId.toString() !== displaced.meetingId.toString())
                let today = getDateForSequence(startDate,seq,skipDays)
                let end = timeToMinutes(getDayEndTime(userId,today))
                let start = timeToMinutes(getDayStartTime(userId,today))
                const availableTime =  end - start
                let timeDiv = availableTime / intensityValues[schedule.intensity].value.meetingsPerDay

                if(dominoCurrentEntries.length === 0){
                    
                    displaced.sequence = seq 
                    displaced.date = getDateForSequence(startDate,seq,skipDays)
                    displaced.start = getDayStartTime(userId,displaced.date)
                    continue;
                }
                let endtime = dominoCurrentEntries[0].start;
                displaced.start = dominoCurrentEntries[0].start 
                displaced.date = new Date(dominoCurrentEntries[0].date) 
                displaced.sequence = seq 
                for (let k = 0 ; k < dominoCurrentEntries.length - 1  ; k++){
                    endtime = dominoCurrentEntries[dominoCurrentEntries.length - 1].start
                    
                    dominoCurrentEntries[k].start = dominoCurrentEntries[k+1].start
                    dominoCurrentEntries[k].date = dominoCurrentEntries[k+1].date
                    dominoCurrentEntries[k].sequence = seq
                    
                }
                if(dominoCurrentEntries.length + 1 <= intensityValues[schedule.intensity].value.meetingsPerDay){
                    dominoCurrentEntries[dominoCurrentEntries.length-1].start = minutesToTime(timeToMinutes(endtime) + timeDiv)
                    break;
                }if(dominoCurrentEntries.length === intensityValues[schedule.intensity].value.meetingsPerDay){
                    displaced = dominoCurrentEntries[dominoCurrentEntries.length-1] 
                }
            }

    }
    await schedule.save()
    return schedule;
    
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

