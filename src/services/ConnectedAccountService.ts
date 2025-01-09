import { appDatabase } from "../config/database";
import { ConnectedAccountInfo } from "../entity/ConnectedAccountInfo";

export class ConnectedAccountService {
    private connectedAccountInfoRepo = appDatabase.getRepository(ConnectedAccountInfo);

    async getPmAccountInfo(userId: string) {
        const accountInfo = await this.connectedAccountInfoRepo.findOne({ where: { account: 'pm', userId } });
        return {
            clientId: accountInfo?.clientId,
            clientSecret: accountInfo?.clientSecret
        };
    }
}