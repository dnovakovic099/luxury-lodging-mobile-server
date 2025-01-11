import createHttpError from "http-errors";
import { HostAwayClient } from "../client/Hostaway";
import { ConnectedAccountService } from "./ConnectedAccountService";
import { MobileUserService } from "./MobileUserService";
import { ListingUpdateEntity } from "../entity/ListingUpdate";
import { appDatabase } from "../config/database";
import { In } from "typeorm";

export class ListingService {
    private connectedAccountServices = new ConnectedAccountService();
    private hostAwayClient = new HostAwayClient();
    private mobileUserService = new MobileUserService();
    private listingUpdateRepo = appDatabase.getRepository(ListingUpdateEntity);

    private async getListingAssociatedWithUser(user_id: string, hostawayId: number) {
        const { clientId, clientSecret } = await this.connectedAccountServices.getPmAccountInfo(user_id);
        if (!clientId || !clientSecret) {
            return createHttpError(403, "Associated PM account not found");
        }

        let listings = await this.hostAwayClient.getListingByUserId(hostawayId, clientId, clientSecret);
        return listings;
    }

    public async getListingUpdates(userId: number, page: number | null, listingId: number | null) {
        const mobileUser = await this.mobileUserService.findOneById(userId);
        if (!mobileUser) {
            return createHttpError(404, "User not found");
        }

        const listings = await this.getListingAssociatedWithUser(mobileUser.user_id, mobileUser.hostawayId);
        if (listings.length == 0) {
            return [];
        }

        const ids = listings.map((listing: any) => listing.id);
        const listingMap = listings.reduce((map: Record<number, string>, listing: any) => {
            map[listing.id] = listing.name;
            return map;
        }, {});

        if (listingId && !ids.includes(listingId)) {
            throw createHttpError(403, "Forbidden request for listing");
        }

        const searchCondition = {
            userId: mobileUser.user_id,
            ...(listingId ? { listingId } : { listingId: In(ids) }),
        };

        const offset = page ? (page - 1) * 10 : 0;
        const updates = await this.listingUpdateRepo.find({
            where: searchCondition,
            order: { id: 'DESC' },
            take: 10,
            skip: offset,
            select: ['listingId', 'date', 'action']
        });

        const updatesWithNames = updates.map((update) => ({
            ...update,
            listingName: listingMap[update.listingId],
        }));

        return updatesWithNames;
    }
}