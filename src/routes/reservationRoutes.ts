import { Router, request } from "express";
import authenticate from "../middlewares/authenticate";
import { validate } from "../helpers/validate";
import { ReservationController } from "../controllers/ReservationController";
import { newReservationSchema } from "../validation/reservation";

const router = Router();
const reservationController = new ReservationController();

router.route('/new-reservation')
    .post(
        validate(newReservationSchema),
        reservationController.processNewReservation
    );

export default router;