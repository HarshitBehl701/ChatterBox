import Joi from 'joi';

const registerUserValidationSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).max(16).required(),
});

const loginUserValidationSchema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().min(8).max(16).required(),
});

const updateUserValidationSchema = Joi.object({
    name: Joi.string().optional().allow(''),
    username: Joi.string().min(3).max(30).optional().allow(''),
    email: Joi.string().email().optional().allow(''),
    password: Joi.string().min(8).max(16).optional().allow(''),
    status: Joi.string().valid('online', 'offline').optional().allow(''),
    is_active: Joi.string().valid('0', '1').optional().allow(''),
});

const manageFriendRequestValidationSchema = Joi.object({
    request_id: Joi.string().required(),
    newStatus: Joi.string().valid('accepted', 'rejected').required(),
});

const removeFriendValidationSchema = Joi.object({
    friend_id: Joi.string().required(),
});

const addFriendValidationSchema = Joi.object({
    friend_id: Joi.string().required(),
});

const getChatsValidationSchema = Joi.object({
    friend_id: Joi.string().required(),
});

export {
    registerUserValidationSchema,
    loginUserValidationSchema,
    updateUserValidationSchema,
    manageFriendRequestValidationSchema,
    removeFriendValidationSchema,
    addFriendValidationSchema,
    getChatsValidationSchema,
};