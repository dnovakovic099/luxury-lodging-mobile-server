import Joi from "joi";

export const getListingUpdatesSchema = Joi.object({
    listingId: Joi.number(),
    page: Joi.number()
});