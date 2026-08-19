import { Request, Response } from "express";
import {createAvailabilityService,
    getAvailabilityService,
    getAvailabilitiesService,
    updateAvailabilityService,
    deleteAvailabilityService} from "../services/availabilityServices"

export const createAvailability = async (req:Request,res:Response) => {

    try {
        const {userId, ...data} = req.body;
        const availability = await createAvailabilityService(userId,data);
        res.status(201).json(availability)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getAvailabilities = async (req:Request,res:Response) => {

    try {
        const Availability = await getAvailabilitiesService();
        res.status(200).json(Availability)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getAvailability = async (req:Request<{id:string}>,res:Response) => {

    try {
        const userId = req.params.id;
        const Availability = await getAvailabilityService(
            userId
        );
        if(!Availability){
            return res.status(404).json({
                message: "Availability not found!"
            })
        }
        return res.status(200).json(Availability)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const updateAvailability = async (req:Request<{id:string}>,res:Response) => {

    try {
        const Availability = await updateAvailabilityService(
            req.params.id,req.body
        );
        if(!Availability){
            res.status(404).json({
                message: "Availability not found!"
            })
        }
        res.status(200).json(Availability)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const deleteAvailability = async (req:Request<{id:string}>,res:Response) => {

    try {
        const Availability = await deleteAvailabilityService(
            req.params.id
        );
        if(!Availability){
            res.status(404).json({
                message: "Availability not found!"
            })
        }
        res.status(200).json(Availability)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}