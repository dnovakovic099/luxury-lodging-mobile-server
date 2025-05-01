import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import logger from "../config/winstonLoggerConfig";
import { CustomRequest } from "../interfaces/User";

export class AuthController {
    async signin(request: Request, response: Response, next: NextFunction) {
        try {
            const { email, password } = request.body;

            const authService = new AuthService();
            const { accessToken, revenueSharing } = await authService.signIn(email, password);

            response.status(200).json({
                success: true,
                accessToken,
                revenueSharing
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }

    async saveFCMToken(request: CustomRequest, response: Response, next: NextFunction) {
        try {
            const { token } = request.body;
            const userId = request.user.userId;
            logger.info(`[saveFCMToken] New token received for user${request.user?.name}`);
            logger.info(`[saveFCMToken] Token: ${token}`)
            const authService = new AuthService();
            const newToken = await authService.saveFCMToken(token, userId);

            response.status(201).json({
                success: true,
                token: newToken
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}
