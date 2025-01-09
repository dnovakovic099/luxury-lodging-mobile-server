import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import logger from "../config/winstonLoggerConfig";

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

}
