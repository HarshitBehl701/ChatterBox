// required  api list
import { addFriend, getAllUserListForAddingNewMembersToGroup, getAllUsers, getOtherUserProfile, getOwnProfileDetails, getUserAllGroups, getUserChats, getUserFriendsList, getUserProfilePicture, loginUser, manageUserFriendList, markUserOffline, markUserOnline, registerUser,updateProfilePicture,updateUserProfile } from "../api/user"
//helpers function
import { token, username } from "./commonHelper";

//-------------------------------------------------helpers-----------------------------------------------

//---------------------------------------------------Login And  Registration-------------------------------------//
export const registration   =  async  (data) =>{
    try{           
        const  response   = await  registerUser(data);
        return response.status  ? {message: "successfully  registered   user",status:true}  : {message: response.message,status:false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export  const login = async  (data)  => {
    try{
        const  response  = await  loginUser(data);
        const responseData  = response.data

        if(response.status){
            //setting   up localstorage
            localStorage.setItem('token',responseData.token)
            localStorage.setItem('user_name',responseData.username)
        }

        return response.status ? {message: "successfully  login   user", status:true}  : {message: response.message, status:false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}
//---------------------------------------------------Login And  Registration-------------------------------------//


export const getUserNameOfCurrentUser =  () => {
    return username;
}

export const getMyProfileDetail = async  ()  =>{
    try{
        const response  = await getOwnProfileDetails(token,username);
        return  response.status  ? {message: "Successfully Fetched My User Profile Details",status: true,data: response.data} : {message: response.message,status: false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export  const  setUserOffline = async  () =>  {
    try{
        const response  = await markUserOffline(token,username);
        return  response.status  ? {message: "Successfully Marked User  Offline",status: true} : {message: response.message,status: false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export  const  setUserOnline = async  () =>  {
    try{
        const response  = await markUserOnline(token,username);
        return  response.status  ? {message: "Successfully Marked User  Online",status: true} : {message: response.message,status: false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export  const getUsersListForAddingNewMembers = async (groupname)  => {
    try{
        const  response  = await   getAllUserListForAddingNewMembersToGroup(token,username,groupname);
        return  response.status  ? {message: "Successfully Fetch  Users List",status: true , data:  response.data} : {message: response.message,status: false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export const updateUserProfileData  = async  (data) => {
    try{
        const  response  =  await updateUserProfile(token,username,data);
        return  response.status  ? {message: "Successfully Updated User  Profile",status: true} : {message: response.message,status: false};
    }catch(error){
        return  {message: error.message,  status: false}
    }
}

export const  userPicture =  async (usernameOfRequiredUser) => {
    try {
        const response  = await getUserProfilePicture(token,username,usernameOfRequiredUser);
        return  response.status  ? {message: "Successfully Fetch User Profile  Photo",status: true,data: response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const  updateUserProfilePhoto = async  (file)  =>  {
    try {
        const formData = new FormData();
        formData.append("profilePicture", file);
        const response = await  updateProfilePicture(token,username,formData);
        return  response.status  ? {message: "Successfully Updated User  Profile",status: true} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  getUsersJoinGroupsList   = async  ()   => {
    try {
        const  response = await getUserAllGroups(token,username);
        return  response.status  ? {message: "Successfully Fetched User  All  Groups",status: true,data:  response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const  getUsersFriends  =  async ()  => {
    try {
        const response  = await  getUserFriendsList(token,username);
        return  response.status  ? {message: "Successfully Fetch Users  Friends List",status: true,data:  response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const getProfileDetail  =  async (requiredUserProfileUsername)  =>  {
    try {
        const response = await getOtherUserProfile(token,username,requiredUserProfileUsername);
        return  response.status  ? {message: "Successfully Fetch  Profile Details",status: true,data:  response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const getAllUsersList  = async  () => {
    try {
        const response = await    getAllUsers();
        return  response.status  ? {message: "Successfully Fetch All Users  List",status: true,data:response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const addNewFriend = async    (requestFriendUsername) =>   {
    try {
        const  response = await  addFriend(token,username,{request_sent_to_user_username:  requestFriendUsername});
        return  response.status  ? {message: "Successfully Sent   Friend Request",status: true} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const manageFriendsList = async (status,friendUsername,friendRequestId) =>  {
    try {
        const  response =  await manageUserFriendList(token,username,{setStatus: status,username:friendUsername,friendListFieldId: friendRequestId});
        return  response.status  ? {message: "Successfully Change Friend Status",status: true} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  getUserAllPreviousChatsWithFriend =  async (friendUserName)  =>{
    try {
        const response = await getUserChats(token,username,{friendUserName:friendUserName});
        return  response.status  ? {message: "Successfully Fetch User Previous Chats",status: true,data:response.data} : {message: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}