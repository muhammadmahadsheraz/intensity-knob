import mongoose,{Schema,Document} from "mongoose"
import { Day } from "./Availability";
export interface IEntry {
    meetingId:mongoose.Types.ObjectId;
    date:Date;
    start:string;
    sequence:number;
    status:"scheduled"|"completed"|"cancelled"|"skipped"|"pending"
}
export interface ISchedule extends Document{
    userId:mongoose.Types.ObjectId;
    intensity:"low"|"mild"|"moderate"|"intense"|"extreme";
    startDate:Date;
    skipDays :Day[];
    entries:IEntry[];
}

const entrySchema = new Schema<IEntry>({
    meetingId:mongoose.Types.ObjectId,
    date:{
        type:Date,
        required:true
    },
    start:{
        type:String,
        required:true
    },
    sequence:{
        type:Number,
        required:true
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
},
{_id:false}
)
const scheduleSchema = new Schema<ISchedule> ({
    userId:mongoose.Types.ObjectId,
    intensity:{
        type:String,
        enum:["low","mild","moderate","intense","extreme"],
        default:"moderate",
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },skipDays:{
        type:[String],
        dafault:[]
    },
    entries:{
        type:[entrySchema],
        default:[],
        required:true
    }

})
export default mongoose.model<ISchedule>(
    "Schedule",scheduleSchema
)
