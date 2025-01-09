import Joi from "joi";

export const revenueCalculationSchema = Joi.object({
    message: Joi.string().required()
});