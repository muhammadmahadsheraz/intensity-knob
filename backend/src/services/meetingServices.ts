import Meeting from "../models/Meetings";
import {IMeeting} from "../models/Meetings";

export const createMeetingService = async (data: Partial<IMeeting>) => {
    const meeting = await Meeting.create(data);
    return meeting;
}
export const getMeetingsService = async (userId:string) => {
    const meetings = await Meeting.find({userId});
    return meetings;
}
export const getMeetingService = async (id: string) => {
    const meeting = await Meeting.findById(id);
    return meeting;
}

export const updateMeetingService = async (id: string,data:Partial<IMeeting>) => {
    const meeting = await Meeting.findByIdAndUpdate(id,data);
    return meeting;
}
export const deleteMeetingService = async (id: string) => {
    const meeting = await Meeting.findByIdAndDelete(id);
    return meeting;
}
