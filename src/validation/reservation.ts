import Joi from "joi";

export const newReservationSchema = Joi.object({
    guestName: Joi.string().required(),
    arrivalDate: Joi.string().required(),
    departureDate: Joi.string().required()
});