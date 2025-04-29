import Joi from "joi";

export const newReservationSchema = Joi.object({
    guestName: Joi.any().required(),
    arrivalDate: Joi.any().required(),
    departureDate: Joi.any().required(),
    totalPrice: Joi.any().required(),
    guestFirstName: Joi.any().required(),
    listingName: Joi.any().required()
});