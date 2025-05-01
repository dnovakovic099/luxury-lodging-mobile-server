import { NextFunction, Request, Response } from "express";
import { appDatabase } from "../config/database";
import { JwtService } from "../services/JwtService";
import { JwtPayload } from "jsonwebtoken";
import logger from "../config/winstonLoggerConfig";
import { User } from "../interfaces/User";
import createHttpError from "http-errors";

interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
    fullname: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            logger.warn(`{Api:${req.url}, Message:"Authorization header missing"}`);
            next(createHttpError(401, 'Authorization header missing'));
        }

        const parts = authHeader!.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            logger.warn(`{Api:${req.url}, Message:"Invalid Authorization header format"}`);
            next(createHttpError(401, 'Invalid Authorization header format'));
        }

        const token = parts[1];
        logger.info(`Auth-Token: ${token}`);
        const jwtServices = new JwtService();
        const { userId, email, name } = (await jwtServices.verify(token)) as TokenPayload;
        (req as Request & { user: User; }).user = { userId, email, name };

        next();
    } catch (error) {
        logger.error(`{Api:${req.url}, Error:${error} }`);
        next(createHttpError(401, 'Unauthorized'));
    }
};

export default authenticate;
