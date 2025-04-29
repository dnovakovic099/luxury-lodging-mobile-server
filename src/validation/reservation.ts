import Joi from "joi";

export const newReservationSchema = Joi.object({
    guestName: Joi.string().required(),
    arrivalDate: Joi.string().required(),
    departureDate: Joi.string().required(),
    totalPrice: Joi.number().required(),
    guestFirstName: Joi.string().required(),
    listingName: Joi.string().required()
});