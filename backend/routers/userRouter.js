const express  =  require('express');
const router = express.Router();

//controllers
const  {registerUser,loginUser,updateUserProfile,getOwnProfileDetails,getOtherProfileDetails,getAllUsersList,addFriendUser,manageUserFriendList,getUserFriendList,getChatsData,getUserAllGroups, updateProfilePicture, getUserProfilePicture, getAllUserListForAddingNewMembersToGroup, markUserOffline, markUserOnline} = require('../controllers/UserController');

//middlewares
const validate = require('../middlewares/validate');
const {registerUserValidationSchema,loginUserValidationSchema,updateUserValidationSchema,getOtherProfileValidationSchema,getUserProfilePictureValidationSchema,addFriendValidationSchema,manageFriendListValidationSchema,getChatsValidationSchema, getAllUserListForAddingNewMembersToGroupValidationSchema}  = require('../validations/userValidations');
const isLoggedIn  =  require('../middlewares/isLoggedIn');
const { upload, handleMulterErrors } = require('../utils/multer');

//routers
router.post('/create_user',validate(registerUserValidationSchema),registerUser);

router.post('/login_user',validate(loginUserValidationSchema),loginUser);

router.post('/update_user',isLoggedIn,validate(updateUserValidationSchema),updateUserProfile);

router.post('/mark_user_offline',isLoggedIn,markUserOffline);
router.post('/mark_user_online',isLoggedIn,markUserOnline);

router.post('/upload_profile_picture',isLoggedIn,upload.single('profilePicture'),handleMulterErrors,updateProfilePicture);

router.post('/get_user_profile_picture',isLoggedIn,validate(getUserProfilePictureValidationSchema),getUserProfilePicture);

router.post('/get_own_profile_detail',isLoggedIn,getOwnProfileDetails);

router.post('/get_user_all_groups',isLoggedIn,getUserAllGroups);

router.post('/get_user_friends_list',isLoggedIn,getUserFriendList);

router.post('/get_other_profile_detail',isLoggedIn,validate(getOtherProfileValidationSchema),getOtherProfileDetails);

router.post('/get_all_users',getAllUsersList);

router.post('/get_all_users_for_new_members_adding_to_group',isLoggedIn,validate(getAllUserListForAddingNewMembersToGroupValidationSchema),getAllUserListForAddingNewMembersToGroup);

router.post('/add_friend',isLoggedIn,validate(addFriendValidationSchema),addFriendUser);

router.post('/manage_friend_list',isLoggedIn,validate(manageFriendListValidationSchema),manageUserFriendList);

router.post('/get_user_chats',isLoggedIn,validate(getChatsValidationSchema),getChatsData);

module.exports = router;