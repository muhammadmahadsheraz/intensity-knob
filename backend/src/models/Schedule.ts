import mongoose,{Schema,Document} from "mongoose"

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
