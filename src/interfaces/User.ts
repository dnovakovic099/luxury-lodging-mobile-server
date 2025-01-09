import { Request } from "express";

export interface User {
    userId: string;
    email: string;
    name: string;
}

export interface CustomRequest extends Request {
    user?: any;
}