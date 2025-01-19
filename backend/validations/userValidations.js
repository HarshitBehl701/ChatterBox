const  Joi  = require('joi');

const registerUserValidationSchema  = Joi.object({
    'name':  Joi.string().required().min(3),
    'email':  Joi.string().email().required(),
    'username':  Joi.string().required().min(3).max(30),
    'password':  Joi.string().min(8).max(16).required(),
});

const loginUserValidationSchema  = Joi.object({
    'username':  Joi.string().required().min(3).max(30),
    'password':  Joi.string().min(8).max(16).required(),
});

const getOtherProfileValidationSchema =   Joi.object({
    'username':  Joi.string().min(3).required()
})


const  addFriendValidationSchema = Joi.object({
    'request_sent_to_user_username': Joi.string().min(3).required()
})

const   manageFriendListValidationSchema = Joi.object({
    friendListFieldId: Joi.string().required(),
    setStatus: Joi.string().valid('request','accepted','rejected').required(),
    username: Joi.string().min(3).required(),
})

const getChatsValidationSchema = Joi.object({
    friendUserName:  Joi.string().min(3).required()
})

module.exports =  {registerUserValidationSchema,loginUserValidationSchema,getOtherProfileValidationSchema,addFriendValidationSchema,manageFriendListValidationSchema,getChatsValidationSchema}