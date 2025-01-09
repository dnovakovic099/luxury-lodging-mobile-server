import { NextFunction, Request, Response } from "express";

export const validate = (schema: any) => {

    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(error);
        }

        next();
    };
};