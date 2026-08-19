export interface Meeting  {
    _id:string
    userId:string
    title:string;
    description?:string;
    participants:string[];
    duration: number;
    deadline:Date;
    sequence?:number;
    status:"scheduled"|"completed"|"cancelled"|"skipped"|"pending";
};

export interface CreateMeeting  {
    userId:string
    title:string;
    description?:string;
    participants:string[];
    duration: number;
    deadline:Date;
};
export interface MeetingFormData {
    title: string;
    participants: string;
    description: string;
    deadline: string;
    duration: string;
}
