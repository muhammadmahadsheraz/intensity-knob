export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
}

export interface LoginUser {
    email: string;
    password: string;
}