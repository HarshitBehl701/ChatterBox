const bcrypt = require('bcrypt');
const UserModal =  require('../modals/UserModal');
const GroupModal =  require('../modals/GroupModal');
const FriendRequestModal =  require('../modals/FriendRequestModal');
const ChatsModal = require('../modals/ChatsModal');
const fs = require("fs");
const path = require("path");
const  jwt  =  require('jsonwebtoken');


const registerUser  = async  (req,res)  => {
    try{ 
        const  {name,email,username,password} = req.body;

        const hashPassword  = await bcrypt.hash(password,10);

        const userExists = await UserModal.findOne({
            $or: [
                { email: email },
                { username: username }
            ],is_active: 1
        });

        if (userExists) {
            return res.status(409).send({ message: `User Already Found With This ${userExists.email === email ? 'Email'   :  'Username'}`, status: false });
        }

        const user =  await  UserModal.create({
            name : name,
            email : email,
            username : username,
            password : hashPassword,
        });
        
        return   res.status(201).send({message: "User  Registered Successfully",status:true});

    }catch(error){
        return res.status(500).send({message: error.message,status:false});
    }
}

const  loginUser = async (req,res)  =>  {
    try{ 
        const  {username,password} = req.body;

        const user = await UserModal.findOne({username,is_active: 1});

        const is_password_match  = await bcrypt.compare(password,user.password);

        if(!is_password_match)  return res.status(401).send({message: "Username  Or Password Not Matched",status:false});
        
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        user.status  = 'online';
        await  user.save();

        return   res.status(201).send({message: "User  Registered Successfully",status:true   , data: {token :  token   , username: user.username}});

    }catch(error){
        return res.status(500).send({message: error.message,status:false});
    }
}

const  markUserOffline = async  (req,res)  =>{
    try{

        const user = await  UserModal.findOneAndUpdate({_id:req.userId,username: req.userName,is_active: 1},{status:  "offline"},{new:  true});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        return  res.status(200).send({message: "Profile Updated  Successfully",status:true});

    }catch(error){
        return  res.status(500).send({message: error.message,status:false});
    }
}

const  markUserOnline = async  (req,res)  =>{
    try{

        const user = await  UserModal.findOneAndUpdate({_id:req.userId,username: req.userName,is_active: 1},{status:  "online"},{new:  true});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        return  res.status(200).send({message: "Profile Updated  Successfully",status:true});

    }catch(error){
        return  res.status(500).send({message: error.message,status:false});
    }
}

const updateUserProfile  = async  (req,res) =>{
    try{
        const  {name , username} = req.body

        const user = await  UserModal.findOneAndUpdate({_id:req.userId,username: req.userName,is_active: 1},{name:  name},{new:  true});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        if(user.username !== username){
            const isUserNameExists =  await  UserModal.findOne({username: username});

            if(isUserNameExists._id   !==   user._id){
                return  res.status(400).send({message:  "Username already Exists",status: false});
            }

            user.username  = username;
        }

        await  user.save();

        return  res.status(200).send({message: "Profile Updated  Successfully",status:true});

    }catch(error){
        return  res.status(500).send({message: error.message,status:false});
    }
}

const  getUserProfilePicture =  async  (req,res) =>   {
    try{

        const {username} = req.body;

        const user  =  await UserModal.findOne({username: username,is_active: 1});

        if(!user)
            return res.status(409).send({message: "User Not  Found",status: false});

        return res.status(200).send({message: "Resource  Found Successfully",status: true,data: user.picture});

    }catch(error){
        return    res.status(500).send({message: error.message,status:false});
    }
} 

const  updateProfilePicture  = async (req,res) => {
    try{

        const user = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active: 1});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        if(user.picture   && user.picture != req.storedFileName){
            
            const oldPicturePath = path.resolve(process.cwd(),"../frontend/src/assets/images/profilePicture",user.picture).trim();
            
            if (fs.existsSync(oldPicturePath)) {
                try {
                    fs.unlinkSync(oldPicturePath);
                } catch (unlinkErr) {
                    console.error("Error removing old file:", unlinkErr.message);
                }
            }
            
        }

        user.picture = req.storedFileName;
        await user.save();

        return  res.status(200).send({message: "Profile Picture  Updated  Successfully",status:true});

    }catch(error){
        return  res.status(500).send({message: error.message,status:false});
    }
}

const getOwnProfileDetails  = async   (req,res) => {
    try{
        const user = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active: 1});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});
        
        const friendRequestReceived = await FriendRequestModal.find({request_sent_to_user_id:  user._id,  is_active:  1 , status: 'request'}).select('status').populate({path:  "request_sent_by_user_id",select:'name  username picture'});

        const friendsListRawData = await FriendRequestModal.find({
            $or: [
              { request_sent_by_user_id: user._id },
              { request_sent_to_user_id: user._id },
            ],
            is_active: 1,
            status: 'accepted',
          }).populate({
            path: "request_sent_by_user_id request_sent_to_user_id",
            select: 'name username picture',
          });

        const friendsList = friendsListRawData.map(friend => {
            if (friend.request_sent_by_user_id._id.toString() === user._id.toString()) {
              return {
                id: friend._id,
                friendDetails: friend.request_sent_to_user_id,
              };
            } else if (friend.request_sent_to_user_id._id.toString() === user._id.toString()) {
              return {
                id: friend._id,
                friendDetails: friend.request_sent_by_user_id,
              };
            }
          });

        const requiredData  = {
            name: user.name,
            picture: user.picture,
            username: user.username,
            email: user.email,
            contact: user.contact,
            friendsList: friendsList,
            friendRequestReceived: friendRequestReceived,
        }

        return res.status(200).send({message:  "User  Found  Successfully",status:true,data: requiredData});

    }catch(error){
        return  res.status(500).send({message:  error.message,status:false});
    }
}

const getUserFriendList =  async  (req,res) =>  {
    try{
        const user = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active: 1});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        const friendsListRawData = await FriendRequestModal.find({
            $or: [
              { request_sent_by_user_id: user._id },
              { request_sent_to_user_id: user._id },
            ],
            is_active: 1,
            status: 'accepted',
          }).populate({
            path: "request_sent_by_user_id request_sent_to_user_id",
            select: 'name username picture status',
          });

        const friendsList = friendsListRawData.map(friend => {
            if (friend.request_sent_by_user_id._id.toString() === user._id.toString()) {
              return friend.request_sent_to_user_id;
            } else if (friend.request_sent_to_user_id._id.toString() === user._id.toString()) {
              return friend.request_sent_by_user_id;
            }
        });      
        
        return res.status(200).send({message:  "Resource Found  Successfully",status:true,data: friendsList});

    }catch(error){
        return  res.status(500).send({message:  error.message,status:false});
    }
}   

const  getUserAllGroups = async  (req,res) => {
    try{
        const user = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active: 1});

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});

        const groups =  await  GroupModal.find({$or:  [
            {members: user._id},
            {adminUserId: user._id},
        ] ,is_active:  1}).select(['name','adminUserId','status','picture']).populate({
            path: 'adminUserId',
            select: 'username name',
        });

        const requiredData  =  groups.map((val) =>  {
            return  {
              'groupId': val._id,
              'groupName': val.name,
              'groupPicture': val.picture,
              'adminUsername': val.adminUserId.username,
              'adminName': val.adminUserId.name,
              'status': val.status,
            }
          })

        return res.status(200).send({message:  "Resource Found  Successfully",status:true,data:requiredData});
    }catch(error){
        return  res.status(500).send({message:  error.message,status:false});
    }
}

const getOtherProfileDetails  = async   (req,res) => {
    try{
        const  {username}  = req.body;

        const user = await  UserModal.findOne({username: username, is_active:  1}).select(['name','username','picture']);

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});
    
        const  friendListStatusWithCurrentUser = await FriendRequestModal.findOne({request_sent_by_user_id: req.userId,  request_sent_to_user_id:  user._id, status: {$ne : 'rejected'} , is_active: 1});
        
        const requiredData  = {
            name: user.name,
            picture: user.picture,
            username: user.username,
            email: user.email,
            contact: user.contact,
            friendStatus: friendListStatusWithCurrentUser?.status  ?? false
        }

        return res.status(200).send({message:  "User  Found  Successfully",status:true,data: requiredData});

    }catch(error){
        return  res.status(500).send({message:  error.message,status:false});
    }
}

const  getAllUsersList = async  (_,res) => {
    try{
        const  users = await UserModal.find({is_active:  1});

        if(!users) return res.status(404).send({message: "Resource  Not  found",status:true,  data: []});

        const requiredData =  users.map((user) =>  ({
            name: user.name, 
            username: user.username, 
            picture: user.picture, 
        }));

        return res.status(200).send({message: "Resource Fetch Successfully",status:true,data: requiredData});

    }catch(error){
        return  res.status(500).send({message: error.message,  status:false});
    }
}

const  getAllUserListForAddingNewMembersToGroup = async  (req,res) => {
    try{
        const {groupName}  = req.body

        const user = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active: 1});        

        const  allUsers = await UserModal.find({_id: {$ne: req.userId},is_active:  1});
        
        const group   = await GroupModal.findOne({name: groupName,adminUserId: req.userId, is_active: 1, status:  'active'})

        if(!user || !allUsers || !group) return res.status(404).send({message: "Resource  Not  found",status:true,  data: []});

        const  members = group.members;


        const filteredUsers =  allUsers.filter((user) =>  {
            return members.indexOf(user._id) == -1;
        });

        const requiredData =  filteredUsers.map((user) =>  ({
            name: user.name, 
            username: user.username, 
            picture: user.picture, 
        }));

        return res.status(200).send({message: "Resource Fetch Successfully",status:true,data: requiredData});

    }catch(error){
        return  res.status(500).send({message: error.message,  status:false});
    }
}

const  addFriendUser = async  (req,res) => {
    try{
        const {request_sent_to_user_username}  =  req.body;

        const  request_sent_by_user  = await  UserModal.findOne({_id:req.userId,username: req.userName,is_active:  1});

        const  request_sent_to_user  = await  UserModal.findOne({username: request_sent_to_user_username,is_active:   1});

        if(!request_sent_by_user  || !request_sent_to_user){
            return res.status(409).send({message: "User  Not  Found",status:false});
        }

        const  previousRequest  =   await   FriendRequestModal.findOne({request_sent_by_user_id:request_sent_by_user._id,request_sent_to_user_id:  request_sent_to_user._id,is_active: 1,status: { $ne: 'rejected' }});

        if(previousRequest)  return res.status(400).send({message: "Request Already Exists, Please  Wait For  Previous  Request  To Be   Fullfilled",status:false});

        try{
            const  add_friend =  await  FriendRequestModal.create({
                request_sent_by_user_id:  request_sent_by_user._id,
                request_sent_to_user_id:  request_sent_to_user._id,
                status:  'request',
            });

            return  res.status(200).send({message: "Request  Sent  Successfully",status:true});
        }catch(friendRequestCreateError){
            return  res.status(500).send({message: friendRequestCreateError.message,status:false});
        }

    }catch(error){
        return  res.status(500).send({message: error.message,status:false});
    }
}

const  manageUserFriendList =  async  (req,res) =>   {
    try{        
        const {setStatus,username,friendListFieldId} =   req.body

        const  requestSentToUser = await UserModal.findOne({username: username,is_active:1});
        
        const requestSentByUser  = await  UserModal.findOne({_id: req.userId,is_active:1});

        if(!requestSentToUser  || !requestSentByUser)  return res.status(409).send({message: "User   Not   Found",status:false});        

        const friendListField =  await FriendRequestModal.findOneAndUpdate({_id: friendListFieldId,is_active: 1},{status: setStatus},{new:  true});
                
        if(!friendListField)  return res.status(409).send({message: "Some  Unexpected  Error Occured",status:false});

        const  previousFriendListOfSentByUser  = requestSentByUser.friendsList;
        const previousFriendListOfSentToUser = requestSentToUser.friendsList;

        const isFriendExistsInSentByUserPreviousList  = previousFriendListOfSentByUser.indexOf(requestSentToUser._id);

        const isFriendExistsInSentToUserPreviousList  = previousFriendListOfSentToUser.indexOf(requestSentByUser._id);

        if(isFriendExistsInSentByUserPreviousList ==  -1){
            previousFriendListOfSentByUser.push(requestSentToUser._id);
        }else{
            previousFriendListOfSentByUser.splice(isFriendExistsInSentByUserPreviousList,1);
        }

        if(isFriendExistsInSentToUserPreviousList ==  -1){
            previousFriendListOfSentToUser.push(requestSentByUser._id);
        }else{
            previousFriendListOfSentToUser.splice(isFriendExistsInSentToUserPreviousList,1);
        }

        requestSentByUser.friendsList =  previousFriendListOfSentByUser;
        requestSentToUser.friendsList = previousFriendListOfSentToUser;
        await requestSentByUser.save();
        await requestSentToUser.save();

        
        return res.status(200).send({message: "Successfully Updated  Friend List",status:true});
    }catch(error){
        return res.status(500).send({message:  error.message, status:false});
    }
}

const getChatsData  = async (req,res)   =>  {
    try{
        const {friendUserName} = req.body;
        
        const  user =  await   UserModal.findOne({_id: req.userId,username:  req.userName,is_active: 1});
        const friendData = await  UserModal.findOne({username: friendUserName,is_active: 1})

        if(!user  || !friendData)  return  res.status(409).send({message: "User  Not Found",status:false});

        const chats  = await ChatsModal.find({  $or  : [
            {
                sender_unique_id: user._id,
                receiver_unique_id: friendData._id,
            },
            {
                sender_unique_id: friendData._id,
                receiver_unique_id: user._id,
            }
        ],
        is_active:  1,
        }).select(['message','createdAt','status']).populate({path:   "sender_unique_id   receiver_unique_id", select: 'username picture'});

        return  res.status(200).send({message: "Resource Fetch   Successfully",status:true,  data:  {
            chats: chats,
            friendProfilePicture: friendData.picture,
            myProfilePicture: user.picture
        }});

    }catch(error){
        return res.status(500).send({message: error.message, status: false});
    }
}

module.exports  = {registerUser,loginUser,markUserOffline,markUserOnline,updateUserProfile,updateProfilePicture,getOwnProfileDetails,getUserFriendList,getUserAllGroups,getUserProfilePicture,getOtherProfileDetails,getAllUsersList,getAllUserListForAddingNewMembersToGroup,addFriendUser,manageUserFriendList,getChatsData}