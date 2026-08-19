import mongoose,{Schema,Document} from "mongoose"

export interface IMeeting extends Document {
    userId:mongoose.Types.ObjectId
    title:string;
    description?:string;
    participants:string[];
    duration: number;
    deadline:Date;
    sequence?:number;
    status:"scheduled"|"completed"|"cancelled"|"skipped"|"pending";
};
const meetingSchema = new Schema<IMeeting>({
    userId:mongoose.Types.ObjectId,
    title:{
        type:String,
        required:true
    },
    description:String,
    participants:{
        type:[String],
        default:[],
        required:true
    },
    duration:{
        type:Number,
        required :true
    },
    deadline:{
        type:Date,
        required:true
    },sequence:{
        type:Number,
    },
    status:{
        type:String,
        enum:[
            "scheduled",
            "completed",
            "cancelled",
            "skipped",
            "pending"
        ]
    },
})

export default mongoose.model<IMeeting>(
    "Meeting",meetingSchema
);
