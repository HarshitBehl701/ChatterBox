import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

// Controllers
import { registerUser, loginUser, getChatsData, getUserAllGroups, logoutUser, updateUser, getUserDetails, getAllActiveUsersList, manageFriendRequest, removeFriend, addFriend, getUserAllFriendRequests } from '../controllers/UserController';

// Middlewares
import validate from '../middlewares/validate';
import { registerUserValidationSchema, loginUserValidationSchema, updateUserValidationSchema, manageFriendRequestValidationSchema, getChatsValidationSchema, removeFriendValidationSchema, addFriendValidationSchema } from '../validations/userValidations';
import { upload, handleMulterErrors } from '../middlewares/multer';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Routes
router.post('/register', validate(registerUserValidationSchema), registerUser);
router.post('/login', validate(loginUserValidationSchema), loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/get_user_details', authMiddleware, getUserDetails);
router.post('/update_user', authMiddleware, upload.single('profilePicture'), handleMulterErrors, validate(updateUserValidationSchema), updateUser);
router.post('/get_all_active_users', authMiddleware, getAllActiveUsersList);
router.post('/manage_friend_request', authMiddleware, validate(manageFriendRequestValidationSchema), manageFriendRequest);
router.post('/get_user_all_groups', authMiddleware, getUserAllGroups);
router.post('/get_user_all_friends_requests', authMiddleware, getUserAllFriendRequests);
router.post('/remove_friend', authMiddleware, validate(removeFriendValidationSchema), removeFriend);
router.post('/add_friend', authMiddleware, validate(addFriendValidationSchema), addFriend);
router.post('/get_user_chats', authMiddleware, validate(getChatsValidationSchema), getChatsData);

export default router;