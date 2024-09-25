import Joi from "joi";

// Schema for validating user login
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    }),
});

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.min": "Username must be atleast {#limit} characters",
        "string.max": "Username must not exceed {#limit} characters",
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),
    password: Joi.string().required().min(7).max(30).pattern(new RegExp('^[a-zA-Z0-9]{7,30}$')).messages({
        "string.min": "Password must be atleast {#limit} characters",
        "string.pattern.base": "Password must contain only letters and numbers",
        "string.max": "Password must not exceed {#limit} characters",
        'any.required': 'Password is required'
    }),
});