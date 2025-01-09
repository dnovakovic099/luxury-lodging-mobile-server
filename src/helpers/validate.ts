import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validate = (schema: Joi.Schema, request: Object) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(request);

        if (error) {
            return next(error);
        }

        next();
    };
};