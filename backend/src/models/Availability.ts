import mongoose from "mongoose";
import Mongoose,{Schema,Document} from "mongoose"
interface ISlot  {
    start:string;
    end:string;
}
export interface IAvailability extends Document {
    userId:mongoose.Types.ObjectId;
    monday:ISlot[];
    tuesday:ISlot[];
    wednesday:ISlot[];
    thursday:ISlot[];
    friday:ISlot[];
    saturday:ISlot[];
    sunday:ISlot[];
} 
const timeSlotSchema = new Schema<ISlot> ({
    start:{
        type:String,
        required :true
    },end:{
        type:String,
        required:true
    }
},
{
    _id:false
}
);
const availabilitySchema = new Schema<IAvailability>({
    userId:mongoose.Types.ObjectId,
    monday:{
        type :[timeSlotSchema]
        ,required:true
    },tuesday:{
        type :[timeSlotSchema]
        ,required:true
    },wednesday:{
        type :[timeSlotSchema]
        ,required:true
    },thursday:{
        type :[timeSlotSchema]
        ,required:true
    },friday:{
        type :[timeSlotSchema]
        ,required:true
    },saturday:{
        type :[timeSlotSchema]
        ,required:true
    },sunday:{
        type :[timeSlotSchema]
        ,required:true
    }
})
export type Day =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
export default Mongoose.model<IAvailability>(
    "Availability",
    availabilitySchema
)