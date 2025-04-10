import createHttpError from "http-errors";
import { HostAwayClient } from "../client/Hostaway";
import { appDatabase } from "../config/database";
import { PartnershipInfoEntity } from "../entity/PartnershipInfo";
import { ConnectedAccountService } from "./ConnectedAccountService";
import { MobileUserService } from "./MobileUserService";
import { MobileUserEntity } from "../entity/MobileUser";
import { In } from "typeorm";

export class OwnerPortalService {
    private partnershipInfoRepo = appDatabase.getRepository(PartnershipInfoEntity);
    private mobileUserService = new MobileUserService();
    private connectedAccountServices = new ConnectedAccountService();
    private hostAwayClient = new HostAwayClient();

    async getPartnershipInfo(userId: number) {
        const mobileUser = await this.mobileUserService.findOneById(userId);
        if (!mobileUser) {
            return createHttpError(404, "User not found");
        }

        const { clientId, clientSecret } = await this.connectedAccountServices.getPmAccountInfo(mobileUser!.user_id);
        if (!clientId || !clientSecret) {
            return createHttpError(403, "Associated PM account not found");
        }

        const listings = await this.getListingsByUserId(mobileUser, clientId, clientSecret);

        return await this.partnershipInfoRepo.find({
            where: {
                listingId: In(listings)
            },
            // select: ["listingId", "totalEarned", "pendingCommission", "activeReferral", "yearlyProjection"]
        });
    }

    private async getListingsByUserId(mobileUser: MobileUserEntity, clientId: string, clientSecret: string) {
        let listings = await this.hostAwayClient.getListingByUserId(mobileUser!.hostawayId, clientId, clientSecret);
        return listings.map((listing: { id: number; }) => listing.id);
    }
}