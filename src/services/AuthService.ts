import createHttpError from "http-errors";
import { appDatabase } from "../config/database";
import { MobileUserEntity } from "../entity/MobileUser";
import bcrypt from "bcryptjs";
import { JwtService } from "./JwtService";
import { FCMToken } from "../entity/FCMToken";

export class AuthService {
    private mobileUserRepo = appDatabase.getRepository(MobileUserEntity);
    private fcmTokenRepo = appDatabase.getRepository(FCMToken);
    private jwtServices = new JwtService();

    public async signIn(email: string, password: string) {
        //check if user exists
        const user = await this.mobileUserRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createHttpError(401, "Invalid credentials");
        }


        const token = await this.jwtServices.sign({
            userId: user.id,
            email,
            name: `${user.firstName} ${user.lastName}`
        });

        return {
            accessToken: token,
            revenueSharing: user.revenueSharing
        };
    }

    public async saveFCMToken(token: string, userId: number) {
        const newToken = new FCMToken();
        newToken.token = token;
        newToken.userId = userId;
        return await this.fcmTokenRepo.save(newToken);
    }
}