export interface Entry{
    meetingId:string;
    date:Date;
    start:string;
    sequence:number;
    status:"scheduled"|"completed"|"cancelled"|"skipped"|"pending"
}
export interface Schedule {
    _id:string
    userId:string;
    intensity:"low"|"mild"|"moderate"|"intense"|"extreme";
    startDate:Date;
    entries:Entry[];
}
export interface CreateSchedule {
    userId:string;
    intensity:"low"|"mild"|"moderate"|"intense"|"extreme";
    entries:Entry[];
}
