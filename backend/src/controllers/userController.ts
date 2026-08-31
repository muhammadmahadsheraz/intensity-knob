import { Request, Response } from "express";
import {createUserService,
    getUserService,
    getUsersService,
    updateUserService,
    deleteUserService,
    loginUserService} from "../services/userServices"

export const createUser = async (req:Request,res:Response) => {

    try {
        const User = await createUserService(req.body);
        res.status(201).json(User)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getUsers = async (req:Request,res:Response) => {

    try {
        const User = await getUsersService();
        res.status(200).json(User)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const getUser = async (req:Request<{id:string}>,res:Response) => {

    try {
        const User = await getUserService(
            req.params.id
        );
        if(!User){
            res.status(404).json({
                message: "User not found!"
            })
        }
        res.status(200).json(User)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const updateUser = async (req:Request<{id:string}>,res:Response) => {

    try {
        const User = await updateUserService(
            req.params.id,req.body
        );
        if(!User){
            res.status(404).json({
                message: "User not found!"
            })
        }
        res.status(200).json(User)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const deleteUser = async (req:Request<{id:string}>,res:Response) => {

    try {
        const User = await deleteUserService(
            req.params.id
        );
        if(!User){
            res.status(404).json({
                message: "User not found!"
            })
        }
        res.status(200).json(User)
    }catch(error){
        res.status(500).json({
            message : error
        })
    }

}
export const loginUser = async (req: Request,res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await loginUserService(email,password);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed"
        });
    }
};