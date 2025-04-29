import { AuthController } from "../controllers/AuthController";
import { request, Router } from "express";
import { validate } from "../helpers/validate";
import { authSchema, fcmTokenSchema } from "../validation/authSchema";
import authenticate from "../middlewares/authenticate";

const router = Router();
const authController = new AuthController();

router.route('/signin').post(validate(authSchema), authController.signin);

router.route('/fcm-token').post(authenticate, validate(fcmTokenSchema), authController.saveFCMToken)

export default router;