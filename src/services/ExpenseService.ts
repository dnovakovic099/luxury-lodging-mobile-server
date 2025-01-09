import createHttpError from "http-errors";
import { appDatabase } from "../config/database";
import { MobileUserService } from "./MobileUserService";
import { ConnectedAccountService } from "./ConnectedAccountService";
import { HostAwayClient } from "../client/Hostaway";
import { MobileUserEntity } from "../entity/MobileUser";

export class ExpenseService {
    private mobileUserService = new MobileUserService();
    private connectedAccountServices = new ConnectedAccountService();
    private hostAwayClient = new HostAwayClient();

    public async getTotalExpenseByUserId(userId: number, listingId: number | null) {

        const mobileUser = await this.mobileUserService.findOneById(userId);
        if (!mobileUser) {
            return createHttpError(404, "User not found");
        }

        const { clientId, clientSecret } = await this.connectedAccountServices.getPmAccountInfo(mobileUser!.user_id);
        if (!clientId || !clientSecret) {
            return createHttpError(403, "Associated PM account not found");
        }

        const listings = await this.getListingsByUserId(userId, listingId, mobileUser, clientId, clientSecret);

        const expenses = await this.getExpenses(listings, clientId, clientSecret);
        let totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0) || 0;

        return { totalExpense };
    }

    private async getListingsByUserId(userId: number, listingId: number | null, mobileUser: MobileUserEntity, clientId: string, clientSecret: string) {
        let listings = await this.hostAwayClient.getListingByUserId(mobileUser!.hostawayId, clientId, clientSecret);
        if (listingId) {
            listings = listings.filter((listing: { id: number; }) => listing.id == listingId);
        }
        return listings;
    }

    private async getExpenses(listings: { id: number; }[], clientId: string, clientSecret: string): Promise<{ amount: number; }[]> {
        //fetch expenses from hostaway
        const expenses = await this.hostAwayClient.getExpenses(clientId, clientSecret);
        if (!expenses || expenses.length === 0) {
            return [{ amount: 0 }];
        }

        //filter expenses by listing map id
        const filteredExpenses = expenses.filter(expense => listings.some((listing: { id: number; }) => expense.listingMapId === listing.id));
        return filteredExpenses;
    }

}