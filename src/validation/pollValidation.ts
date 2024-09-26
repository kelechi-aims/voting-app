import Joi from "joi";

export const pollCreationSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.base': 'Title should be a string',
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title should have a minimum length of {#limit}',
        'string.max': 'Title should have a minimum length of {#limit}',
        'any.required': 'Title is required',
    }),
    options: Joi.array()
        .items(Joi.string().min(1).required())
        .min(2).required().messages({
            'array.base': 'Options should be an array',
            'array.min': 'Options should have a minimum length of {#limit}',
            'any.required': 'Options are required',
            'string.base': 'Each option should be a string',
            'string.empty': 'Option cannot be empty'
        }),
});

export const voteSchema = Joi.object({
    optionId: Joi.string().required().messages({
        'string.base': 'Option should be a string',
        'string.empty': 'Option ID is cannot be empty',
        'any.required': 'Option ID is required',
    })
});

export const paramsSchema = Joi.object({
    pollId: Joi.string().uuid().required().messages({
        'string.base': 'Poll ID should be a string',
        'string.empty': 'Poll ID cannot be empty',
        'string.guid': 'Poll ID should be a valid UUID',
        'any.required': 'Poll ID is required',
    })
});