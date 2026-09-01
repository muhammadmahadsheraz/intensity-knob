import { Request, Response } from "express";

import {createMeetingService,
    getMeetingService,
    getMeetingsService,
    updateMeetingService,
    deleteMeetingService} from "../services/meetingServices"

    //minimal meetings controller
export const createMeeting = async (req:Request,res:Response) => {

    try {
        const meeting = await createMeetingService(req.body);
        res.status(201).json(meeting)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getMeetings = async (req:Request,res:Response) => {

    try {
        const userId = req.params.id;
        const meeting = await getMeetingsService(userId);
        res.status(200).json(meeting)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getMeeting = async (req:Request<{id:string}>,res:Response) => {

    try {
        const meeting = await getMeetingService(
            req.params.id
        );
        if(!meeting){
            res.status(404).json({
                message: "Meeting not found!"
            })
        }
        res.status(200).json(meeting)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const updateMeeting = async (req:Request<{id:string}>,res:Response) => {

    try {
        const meeting = await updateMeetingService(
            req.params.id,req.body
        );
        if(!meeting){
            res.status(404).json({
                message: "Meeting not found!"
            })
        }
        res.status(200).json(meeting)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const deleteMeeting = async (req:Request<{id:string}>,res:Response) => {

    try {
        const meeting = await deleteMeetingService(
            req.params.id
        );
        if(!meeting){
            res.status(404).json({
                message: "Meeting not found!"
            })
        }
        res.status(200).json(meeting)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}