//  required  api list
import { addNewMember, createGroup, getGroupChats, getGroupMembers, getGroupRequestsByUsers, getGroupRequestsToUsers, getGroupsList, groupJoinRequest, manageGroup, manageGroupMembers, manageGroupRequestsByAdmin, manageGroupRequestsByUser, updateGroup, updateGroupPicture } from "../api/group";
//helpers  function
import { token, username } from "./commonHelper";

//-------------------------------------------------helpers-----------------------------------------------
export const createNewGroup = async  (groupname,addingMembersList)   =>  {
    try {
        const response =  await  createGroup(token,username,{groupName: groupname, members: addingMembersList});
        return  response.status  ? {messsage: "Successfully Created New   Group",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const getGroupMembersList = async  (groupname) =>   {
    try {
        const response  = await getGroupMembers(token,username,groupname);
        return  response.status  ? {messsage: "Successfully Fetch  Group  Members  List",status: true,data: response.data} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const getGroupAllIncomingRequestsComesFromUser = async (groupname)   =>  {
    try {
        const response = await getGroupRequestsByUsers(token,username,groupname);
        return  response.status  ? {messsage: "Successfully Fetch All Group Incoming  Requests",status: true,data:  response.data} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export  const getGroupAllIncomingRequestsUserGetsFromGroupAdmin = async ()   =>  {
    try {
        const response = await getGroupRequestsToUsers(token,username);
        return  response.status  ? {messsage: "Successfully Fetch All Groups  Request User  Get  From  Group Admin",status: true,data:  response.data} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const manageAllIncomingGroupRequestsComesFromUser  = async  (groupId, requestUserProfileUsername, action) =>{
    try {
        const response =  await  manageGroupRequestsByAdmin(token,username,{groupId: groupId, username: requestUserProfileUsername, newStatus:  action});
        return  response.status  ? {messsage: "Successfully Completed  Requested Action",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const manageAllIncomingGroupRequestsComesFromGroupAdmin  = async  (groupId, action) =>{
    try {
        const response =  await  manageGroupRequestsByUser(token,username,{groupId: groupId, newStatus:action});
        return  response.status  ? {messsage: "Successfully Completed  Requested Action",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const manageGroupMembersByAdmin = async (groupname,memberUsername,action) =>  {
    try {
        const  response  =  await manageGroupMembers(token,username,{groupName: groupname, username: memberUsername, action:action});
        return  response.status  ? {messsage: "Successfully Change  Member  Status",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  manageGroupByAdmin  = async  (groupname,action) =>  {
    try {
        const response = await  manageGroup(token,username,{groupName:groupname, action:action});
        return  response.status  ? {messsage: "Successfully Change  Group Status",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  updateGroupName = async  (currentGroupName,newGroupName) => {
    try {
        const response = await  updateGroup(token,username,{groupName:currentGroupName, newName:newGroupName});
        return  response.status  ? {messsage: "Successfully Change Group  Name",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  updateGroupImage = async  (file,groupName) => {
    try {
        const formData = new FormData();
        formData.append("groupPicture", file);
        formData.append("groupName", groupName);
        const response = await  updateGroupPicture(token,username,formData);
        return  response.status  ? {messsage: "Successfully Change Group  Image",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  getGroupPreviousChats = async  (groupname) => {
    try {
        const response = await  getGroupChats(token,username,groupname);
        return  response.status  ? {messsage: "Successfully Fetched   Group Previous chats",status: true,data: response.data} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  getGroupsListForJoining = async  () => {
    try {
        const response = await  getGroupsList(token,username);
        return  response.status  ? {messsage: "Successfully Fetched All Groups Listing",status: true,data: response.data} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  addJoinRequestByUser = async  (groupname) => {
    try {
        const response = await  groupJoinRequest(token,username,{groupName:   groupname});
        return  response.status  ? {messsage: "Successfully Sent   Join   Request",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}

export const  addMemberToGroup = async  (usernameOfRequiredPerson,groupname) => {
    try {
        const response = await  addNewMember(token,username,{username: usernameOfRequiredPerson,groupName:groupname});
        return  response.status  ? {messsage: "Successfully Sent Join Request  To  The  User",status: true} : {messsage: response.message,status: false};
    } catch (error) {
        return  {message: error.message,  status: false}
    }
}
