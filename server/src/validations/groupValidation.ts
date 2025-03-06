import Joi from 'joi';

const createGroupSchemaValidation = Joi.object({
    groupName: Joi.string().min(1).required(),
    members: Joi.string().min(3).required()
});

const updateGroupSchemaValidation = Joi.object({
    group_id: Joi.string().required(),
    name: Joi.string().allow('').optional(),
    adminUserId: Joi.string().allow('').optional(),
    members: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    is_active: Joi.string().valid('0', '1').optional(),
});

const manageGroupRequestsByAdminSchemaValidation = Joi.object({
    requestId: Joi.string().required(),
    groupId: Joi.string().required(),
    status: Joi.string().valid('accepted', 'rejected').required(),
});

const manageGroupRequestsByUserSchemaValidation = Joi.object({
    requestId: Joi.string().required(),
    groupId: Joi.string().required(),
    status: Joi.string().valid('accepted', 'rejected').required(),
});

const getGroupChatsSchemaValidation = Joi.object({
    group_id: Joi.string().required(),
});

const groupJoinRequestSchemaValidation = Joi.object({
    groupId: Joi.string().required(),
});

export {
    createGroupSchemaValidation,
    updateGroupSchemaValidation,
    manageGroupRequestsByAdminSchemaValidation,
    manageGroupRequestsByUserSchemaValidation,
    getGroupChatsSchemaValidation,
    groupJoinRequestSchemaValidation,
};