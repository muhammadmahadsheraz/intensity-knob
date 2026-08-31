export interface TimeSlot{
    start:string;
    end:string;
}

export interface Availability {
    _id:string;
    userId:string;
    monday:TimeSlot[];
    tuesday:TimeSlot[];
    wednesday:TimeSlot[];
    thursday:TimeSlot[];
    friday:TimeSlot[];
    saturday:TimeSlot[];
    sunday:TimeSlot[];
}
export interface CreateAvailability {
    userId: string;
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
}
export type Day =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
    