import { NextFunction, Request, Response } from "express";
import { OwnerPortalService } from "../services/OwnerPortalServices";
import { CustomRequest } from "../interfaces/User";
import logger from "../config/winstonLoggerConfig";

export class OwnerPortalController {
    async getPartnershipInfo(request: CustomRequest, response: Response, next: NextFunction) {
        try {
            const userId = request.user.userId;

            const ownerPortalService = new OwnerPortalService();
            const partnershipInfo = await ownerPortalService.getPartnershipInfo(userId);

            response.status(200).json({
                success: true,
                data: partnershipInfo
            });
        } catch (error) {
            logger.error(`{Api:${request.url}, Error: ${error} }`);
            next(error);
        }
    }
}