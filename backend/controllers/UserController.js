const bcrypt = require('bcrypt');
const UserModal =  require('../modals/UserModal');
const FriendRequestModal =  require('../modals/FriendRequestModal');
const ChatsModal = require('../modals/ChatsModal');
const  jwt  =  require('jsonwebtoken');

//for  user   registration
const registerUser  = async  (req,res)  => {
    try{ 
        const  {name,email,username,password} = req.body;

        const hashPassword  = await bcrypt.hash(password,10);

        const userExists = await UserModal.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
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

        const user = await UserModal.findOne({username});

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

const getOwnProfileDetails  = async   (req,res) => {
    try{
        const user = await  UserModal.findOne({_id:req.userId,username: req.userName});

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
        const user = await  UserModal.findOne({_id:req.userId,username: req.userName});

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

const getOtherProfileDetails  = async   (req,res) => {
    try{
        const  {username}  = req.body;

        const user = await  UserModal.findOne({username: username, is_active:  1}).select(['name','username','picture']);

        if(!user) return   res.status(404).send({message:  "Some Unexpected  Error Occured",status:false});
    
        const  friendListStatusWithCurrentUser = await FriendRequestModal.findOne({request_sent_by_user_id: req.userId,  request_sent_to_user_id:  user._id, status: {$ne : 'rejected'} , is_active: 1});
        
        const requiredData  = {
            name: user.name,
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

        return  res.status(200).send({message: "Resource Fetch   Successfully",status:true,  data:  chats});

    }catch(error){
        console.log(error);
        return res.status(500).send({message: error.message, status: false});
    }
}

module.exports  = {registerUser,loginUser,getOwnProfileDetails,getUserFriendList,getOtherProfileDetails,getAllUsersList,addFriendUser,manageUserFriendList,getChatsData}