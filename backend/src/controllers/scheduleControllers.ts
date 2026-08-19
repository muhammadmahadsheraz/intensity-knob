import { Request, Response } from "express";

import {createScheduleService,
    getScheduleService,
    getSchedulesService,
    updateScheduleService,
    deleteScheduleService,
    completeMeetingService,
    skipMeetingService,
    rescheduleSkippedService} from "../services/scheduleServices"

export const createSchedule = async (req:Request,res:Response) => {
    try {
        const {userId,intensity} = req.body;
        const Schedule = await createScheduleService(userId,intensity);
        if(!Schedule){
            return res.status(400).json({
                message: "No meetings available to schedule or no availability set"
            })
        }
        return res.status(201).json(Schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const getSchedules = async (req:Request,res:Response) => {
    try {
        const Schedule = await getSchedulesService();
        return res.status(200).json(Schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const getSchedule = async (req:Request<{id:string}>,res:Response) => {
    try {
        const userId = req.params.id;
        const Schedule = await getScheduleService(userId);
        if(!Schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(Schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const updateSchedule = async (req:Request<{id:string}>,res:Response) => {
    try {
        const Schedule = await updateScheduleService(req.params.id,req.body);
        if(!Schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(Schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const deleteSchedule = async (req:Request<{id:string}>,res:Response) => {
    try {
        const Schedule = await deleteScheduleService(req.params.id);
        if(!Schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(Schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const completeMeeting = async (req:Request<{id:string}>,res:Response) => {
    try {
        const userId = req.query.userId as string;
        const schedule = await completeMeetingService(req.params.id, userId);
        if(!schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const skipMeeting = async (req:Request<{id:string}>,res:Response) => {
    try {
        const userId = req.query.userId as string;
        const schedule = await skipMeetingService(req.params.id, userId);
        if(!schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}

export const rescheduleSkipped = async (req:Request<{id:string}>,res:Response) => {
    try {
        const userId = req.params.id;
        const schedule = await rescheduleSkippedService(userId);
        if(!schedule){
            return res.status(404).json({
                message: "Schedule not found!"
            })
        }
        return res.status(200).json(schedule)
    }catch(error){
        return res.status(500).json({
            message : error
        })
    }
}
