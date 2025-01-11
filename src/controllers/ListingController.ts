import { NextFunction, Request, Response } from "express";
import { ListingService } from "../services/ListingService";
import { CustomRequest } from "../interfaces/User";
import logger from "../config/winstonLoggerConfig";

export class ListingController {
    async getListingUpdates(request: CustomRequest, response: Response, next: NextFunction) {
        try {
            const userId = request.user.userId;
            const listingId = Number(request.query.listingId);
            const page = Number(request.query.page);

            const listingService = new ListingService();
            const listingUpdates = await listingService.getListingUpdates(userId, page, listingId);

            response.status(200).json({
                success: true,
                data: listingUpdates
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}