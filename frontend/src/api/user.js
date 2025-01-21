import axios from "axios";

const userBaseApi =  `${import.meta.env.VITE_API_URL}/v1/user`;

export const registerUser  =   async (data)  => {
    try{
        const response = await axios.post(`${userBaseApi}/create_user`,{...data});
        return  response.data;
    }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
    }
}

export  const  loginUser = async (data)  =>  {
    try{
        const response = await axios.post(`${userBaseApi}/login_user`,{...data});
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getOwnProfileDetails  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_own_profile_detail`,{},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  markUserOffline  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/mark_user_offline`,{},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  markUserOnline  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/mark_user_online`,{},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getAllUserListForAddingNewMembersToGroup  = async  (token,user_name,groupName) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_all_users_for_new_members_adding_to_group`,{groupName: groupName},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  updateUserProfile  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${userBaseApi}/update_user`,{...data},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getUserProfilePicture  = async  (token,user_name,username) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_user_profile_picture`,{username: username},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  updateProfilePicture  = async  (token,user_name,file) => {
    try{

        const formData = new FormData();
        formData.append("profilePicture", file);

        const response = await axios.post(`${userBaseApi}/upload_profile_picture`,formData,{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name,
                "Content-Type": "multipart/form-data",
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getUserAllGroups  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_user_all_groups`,{},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getUserFriendsList  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_user_friends_list`,{},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getOtherUserProfile  = async  (token,login_user_name,other_user_user_name) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_other_profile_detail`,{username: other_user_user_name},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': login_user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getAllUsers  = async  () =>  {
    try{
        const response = await axios.post(`${userBaseApi}/get_all_users`,{});
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  addFriend  = async  (token,request_sent_by_unique_token,data) => {
    try{
        const response = await axios.post(`${userBaseApi}/add_friend`,{...data},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': request_sent_by_unique_token,
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  manageUserFriendList  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${userBaseApi}/manage_friend_list`,{...data},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name,
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}

export const  getUserChats  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${userBaseApi}/get_user_chats`,{...data},{
            headers:{
                Authorization: `Bearer ${token}`,
                'X-User-Name': user_name
            }
        });
        return  response.data;
     }catch(error){
        return {
            status: false,
            message: error.response?.data?.message || "An unexpected error occurred.",
            details: error.response?.data || null,
        };
     }
}