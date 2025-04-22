import Joi from "joi";

export const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

export const fcmTokenSchema = Joi.object({
    token: Joi.string().required()
});