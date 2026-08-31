import Availability from "../models/Availability";
import {IAvailability} from "../models/Availability";

export const createAvailabilityService = async (userId:string,data: Partial<IAvailability>) => {
    const isOldAvailability = await Availability.findOne({userId});
    let availability;
    if(!isOldAvailability){
        availability = await Availability.create({userId, ...data});
    }else{
        availability = await Availability.findOneAndUpdate({userId},data,{new:true});
    }
    return availability;
}
export const getAvailabilitiesService = async () => {
    const availabilities = await Availability.find();
    return availabilities;
}
export const getAvailabilityService = async (userId: string) => {
    const availability = await Availability.findOne({userId});
    return availability;
}

export const updateAvailabilityService = async (userId:string,data:Partial<IAvailability>) => {
    const availability = await Availability.findOneAndUpdate({userId},data,{new:true});
    return availability;
}
export const deleteAvailabilityService = async (id: string) => {
    const availability = await Availability.findByIdAndDelete(id);
    return availability;
}
