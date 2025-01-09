import createHttpError from "http-errors";
import { appDatabase } from "../config/database";
import { MobileUserEntity } from "../entity/MobileUser";
import bcrypt from "bcryptjs";
import { JwtService } from "./JwtService";

export class AuthService {
    private mobileUserRepo = appDatabase.getRepository(MobileUserEntity);

    public async signIn(email: string, password: string) {
        //check if user exists
        const user = await this.mobileUserRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createHttpError(401, "Invalid credentials");
        }

        const jwtServices = new JwtService();
        const token = await jwtServices.sign({
            userId: user.id,
            email,
            name: `${user.firstName} ${user.lastName}`
        });

        return {
            accessToken: token,
            revenueSharing: user.revenueSharing
        };
    }
}