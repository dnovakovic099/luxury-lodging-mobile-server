import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/envConfig";

export class JwtService {
    private getSecret(): string {
        if (!config.JWT_SECRET) {
            throw new Error("JWT Secret is not configured.");
        }
        return config.JWT_SECRET;
    }

    private getExpiry(): string | undefined {
        return config.JWT_EXPIRY;
    }

    public async sign(payload: Object) {
        const options: any = {};
        const expiry = this.getExpiry();

        if (typeof expiry === 'string') {
            options.expiresIn = expiry;
        }

        return jwt.sign(payload, this.getSecret(), options);
    }

    public async verify(token: string) {
        return jwt.verify(token, this.getSecret());
    };
}