
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { config } from '../config/envConfig';
import { HttpError } from 'http-errors';
const { ValidationError } = Joi;

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let data = {
        message: "Internal Server Error",
        ...(config.NODE_ENV === "development" && {
            originalMessage: err.message,
        }),
    };

    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        data = {
            message: err.message,
        };
    }

    if (err instanceof ValidationError) {
        statusCode = 400;
        data = {
            message: err?.message,
        };
    }

    res.status(statusCode).json(data);
};

export default globalErrorHandler;