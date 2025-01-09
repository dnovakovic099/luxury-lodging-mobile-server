
import jwt from "jsonwebtoken";
import { config } from "../config/envConfig";

export class JwtService {
    public async sign(payload: Object) {
        return jwt.sign(payload, config.JWT_SECRET!, { expiresIn: config.JWT_EXPIRY });
    }

    public async verify(token: string) {
        return jwt.verify(token, config.JWT_SECRET!);
    };
}
