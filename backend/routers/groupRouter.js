const express  =  require('express');
const router = express.Router();

//controllers
const  {createGroup,getGroupMembers,getGroupRequestsByUsers,getGroupRequestsToUsers,manageGroupRequestsByAdmin,manageGroupRequestsByUser,manageGroupMembers,manageGroup,getGroupChats,getGroupsList,groupJoinRequest, updateGroupName, updateGroupPicture, addNewMember} = require('../controllers/GroupController');

//middlewares
const validate = require('../middlewares/validate');
const {createGroupSchemaValidation,getGroupMembersSchemaValidation,getGroupRequestsSchemaValidation,manageGroupRequestsByAdminSchemaValidation,manageGroupRequestsByUserSchemaValidation,manageGroupMembersSchemaValidation,manageGroupSchemaValidation,getGroupChatsSchemaValidation,groupJoinRequestSchemaValidation, updateGroupNameSchemaValidation, addNewMemberValidationSchema}  = require('../validations/groupValidation');
const isLoggedIn  =  require('../middlewares/isLoggedIn');
const   {upload,handleMulterErrors} = require('../utils/multer');

//routers
router.post('/create_group',isLoggedIn,validate(createGroupSchemaValidation),createGroup);

router.post('/update_group',isLoggedIn,validate(updateGroupNameSchemaValidation),updateGroupName);

router.post('/update_group_picture',isLoggedIn,upload.single('groupPicture'),handleMulterErrors,updateGroupPicture);

router.post('/get_group_members',isLoggedIn,validate(getGroupMembersSchemaValidation),getGroupMembers);

router.post('/get_group_requests_by_users',isLoggedIn,validate(getGroupRequestsSchemaValidation),getGroupRequestsByUsers);

router.post('/get_group_requests_to_users',isLoggedIn,getGroupRequestsToUsers);

router.post('/manage_group_requests_by_admin',isLoggedIn,validate(manageGroupRequestsByAdminSchemaValidation),manageGroupRequestsByAdmin);

router.post('/manage_group_requests_by_user',isLoggedIn,validate(manageGroupRequestsByUserSchemaValidation),manageGroupRequestsByUser);

router.post('/manage_group_members',isLoggedIn,validate(manageGroupMembersSchemaValidation),manageGroupMembers);

router.post('/manage_group',isLoggedIn,validate(manageGroupSchemaValidation),manageGroup);

router.post('/get_group_chats',isLoggedIn,validate(getGroupChatsSchemaValidation),getGroupChats);

router.post('/get_groups_list',isLoggedIn,getGroupsList);

router.post('/group_join_request',isLoggedIn,validate(groupJoinRequestSchemaValidation),groupJoinRequest);

router.post('/group_join_request_sent_to_user',isLoggedIn,validate(addNewMemberValidationSchema),addNewMember);

module.exports = router;