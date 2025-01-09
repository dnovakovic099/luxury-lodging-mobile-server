import { appDatabase } from "../config/database";
import { MobileUserEntity } from "../entity/MobileUser";

export class MobileUserService {
    private mobileUserRepository = appDatabase.getRepository(MobileUserEntity);

    async findOneById(userId: number): Promise<MobileUserEntity | null> {
        const mobileUser = await this.mobileUserRepository.findOne({ where: { id: userId } });
        return mobileUser;
    }
}