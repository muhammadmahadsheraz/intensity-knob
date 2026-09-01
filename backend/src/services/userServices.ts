import User from "../models/User";
import { IUser } from "../models/User";
import bcrypt from "bcryptjs";

export const createUserService = async (data: Partial<IUser>) => {
    const hashedPassword = await bcrypt.hash(data.password!,10);

    const user = await User.create({...data,password: hashedPassword});

    return user;
};

export const loginUserService = async (email: string,password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        return null;
    }

    const validPassword = await bcrypt.compare(password,user.password);

    if (!validPassword) {
        return null;
    }

    return user;
};

export const getUsersService = async () => {
    return await User.find();
};

export const getUserService = async (id: string) => {
    return await User.findById(id);
};

export const updateUserService = async (id: string,data: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id,data,{ new: true });
};

export const deleteUserService = async (id: string) => {
    return await User.findByIdAndDelete(id);
};