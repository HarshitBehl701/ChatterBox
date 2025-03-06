import express from 'express';

// Controllers
import { createGroup, manageGroupRequestsByAdmin, manageGroupRequestsByUser, getGroupChats, getGroupsList, makeGroupJoinRequest, getGroupAllRequestsForGroupAdmin, updateGroupData, getUserAllGroupsJoinRequests } from '../controllers/GroupController';

// Middlewares
import validate from '../middlewares/validate';
import { createGroupSchemaValidation, manageGroupRequestsByAdminSchemaValidation, manageGroupRequestsByUserSchemaValidation, getGroupChatsSchemaValidation, groupJoinRequestSchemaValidation, updateGroupSchemaValidation } from '../validations/groupValidation';
import authMiddleware from '../middlewares/authMiddleware';
import { upload, handleMulterErrors } from '../middlewares/multer';

const router = express.Router();

// Routes
router.post('/create_group', authMiddleware, upload.single('groupPicture'), handleMulterErrors, validate(createGroupSchemaValidation), createGroup);
router.post('/get_group_all_join_requests_for_admin', authMiddleware, getGroupAllRequestsForGroupAdmin);
router.post('/get_group_all_join_requests_for_user', authMiddleware, getUserAllGroupsJoinRequests);
router.post('/update_group', authMiddleware, upload.single('groupPicture'), handleMulterErrors, validate(updateGroupSchemaValidation), updateGroupData);
router.post('/manage_group_requests_by_admin', authMiddleware, validate(manageGroupRequestsByAdminSchemaValidation), manageGroupRequestsByAdmin);
router.post('/get_group_chats', authMiddleware, validate(getGroupChatsSchemaValidation), getGroupChats);
router.post('/make_group_join_request', authMiddleware, validate(groupJoinRequestSchemaValidation), makeGroupJoinRequest);
router.post('/manage_group_requests_by_user', authMiddleware, validate(manageGroupRequestsByUserSchemaValidation), manageGroupRequestsByUser);
router.post('/get_groups_list', authMiddleware, getGroupsList);

export default router;