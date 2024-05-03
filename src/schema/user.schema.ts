import Joi from "joi";

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
})

const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required(),
})

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    telephone:Joi.string().required(),
    age: Joi.number().required(),
})

export default {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
}