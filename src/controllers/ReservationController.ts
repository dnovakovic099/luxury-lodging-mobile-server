import { NextFunction, Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";
import logger from "../config/winstonLoggerConfig";
import { error } from "console";

export class ReservationController {
    async processNewReservation(request: Request, response: Response, next: NextFunction) {
        try {
            const source = request.headers['x-internal-source'];
            if (source !== 'securestay.ai') {
                logger.error(`[processNewReservation] Invalid source: ${source}`);
                throw new Error(`Invalid Source: ${source}`)
            }

            const reservationService = new ReservationService();
            await reservationService.processNewReservation(request.body);

            response.status(200).json({
                success: true,
                message: 'Handled new reservation for push notification'
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}