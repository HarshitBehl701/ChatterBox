const express  =  require('express');
const router = express.Router();

//controllers
const  {registerUser,loginUser,getOwnProfileDetails,getOtherProfileDetails,getAllUsersList,addFriendUser,manageUserFriendList,getUserFriendList,getChatsData} = require('../controllers/UserController');

//middlewares
const validate = require('../middlewares/validate');
const {registerUserValidationSchema,loginUserValidationSchema,getOtherProfileValidationSchema,addFriendValidationSchema,manageFriendListValidationSchema,getChatsValidationSchema}  = require('../validations/userValidations');
const isLoggedIn  =  require('../middlewares/isLoggedIn');

//routers
router.post('/create_user',validate(registerUserValidationSchema),registerUser);

router.post('/login_user',validate(loginUserValidationSchema),loginUser);

router.post('/get_own_profile_detail',isLoggedIn,getOwnProfileDetails);

router.post('/get_user_friends_list',isLoggedIn,getUserFriendList);

router.post('/get_other_profile_detail',isLoggedIn,validate(getOtherProfileValidationSchema),getOtherProfileDetails);

router.post('/get_all_users',getAllUsersList);

router.post('/add_friend',isLoggedIn,validate(addFriendValidationSchema),addFriendUser);

router.post('/manage_friend_list',isLoggedIn,validate(manageFriendListValidationSchema),manageUserFriendList);

router.post('/get_user_chats',isLoggedIn,validate(getChatsValidationSchema),getChatsData);

module.exports = router;