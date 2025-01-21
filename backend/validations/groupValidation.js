const  Joi  = require('joi');

const  createGroupSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required(),
    members: Joi.array().items(Joi.string().min(3).required()).min(1)
})

const  getGroupMembersSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required()
})

const  getGroupRequestsSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required()
})

const  manageGroupRequestsByAdminSchemaValidation  = Joi.object({
    groupId: Joi.string().required(),
    username: Joi.string().min(3).required(),
    newStatus: Joi.string().valid('accept','rejected').required(),
})

const  manageGroupRequestsByUserSchemaValidation  = Joi.object({
    groupId: Joi.string().required(),
    newStatus: Joi.string().valid('accept','rejected').required(),
})

const  manageGroupMembersSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required(),
    username: Joi.string().min(3).required(),
    action: Joi.string().valid('transfer_ownership','remove_member').required(),
})

const  manageGroupSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required(),
    action: Joi.string().valid('inactive','active','delete').required(),
})

const  getGroupChatsSchemaValidation  = Joi.object({
    groupName: Joi.string().min(1).required(),
})

const  groupJoinRequestSchemaValidation  = Joi.object({
    groupId: Joi.string().required(),
    groupName: Joi.string().min(1).required(),
})

const  addNewMemberValidationSchema  = Joi.object({
    groupName: Joi.string().min(1).required(),
    username: Joi.string().min(3).required(),
})


const updateGroupNameSchemaValidation = Joi.object({
    groupName: Joi.string().min(1).required(),
    newName: Joi.string().required(),
});

module.exports = {createGroupSchemaValidation,getGroupMembersSchemaValidation,getGroupRequestsSchemaValidation,manageGroupRequestsByAdminSchemaValidation,manageGroupRequestsByUserSchemaValidation,manageGroupMembersSchemaValidation,manageGroupSchemaValidation,getGroupChatsSchemaValidation,groupJoinRequestSchemaValidation,updateGroupNameSchemaValidation,addNewMemberValidationSchema}