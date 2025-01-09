import { AuthController } from "../controllers/AuthController";
import { request, Router } from "express";
import { validate } from "../helpers/validate";
import { authSchema } from "../validation/authSchema";

const router = Router();
const authController = new AuthController();

router.route('/signin').post(validate(authSchema, request.body), authController.signin);

export default router;