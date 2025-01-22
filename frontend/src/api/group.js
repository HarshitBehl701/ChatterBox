import axios from "axios";

const groupBaseApi   =  `${import.meta.env.VITE_API_URL}/v1/group`;

export const  createGroup  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/create_group`,{...data},{
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

export const  getGroupMembers  = async  (token,user_name,groupName) => {
    try{
        const response = await axios.post(`${groupBaseApi}/get_group_members`,{groupName: groupName},{
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

export const  getGroupRequestsByUsers  = async  (token,user_name,groupName) => {
    try{
        const response = await axios.post(`${groupBaseApi}/get_group_requests_by_users`,{groupName: groupName},{
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

export const  getGroupRequestsToUsers  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${groupBaseApi}/get_group_requests_to_users`,{},{
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

export const  manageGroupRequestsByAdmin  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/manage_group_requests_by_admin`,{...data},{
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

export const  manageGroupRequestsByUser  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/manage_group_requests_by_user`,{...data},{
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

export const  manageGroupMembers  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/manage_group_members`,{...data},{
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

export const  manageGroup  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/manage_group`,{...data},{
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

export const  updateGroup  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/update_group`,{...data},{
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

export const  updateGroupPicture  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/update_group_picture`,data,{
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

export const  getGroupChats  = async  (token,user_name,groupName) => {
    try{
        const response = await axios.post(`${groupBaseApi}/get_group_chats`,{groupName: groupName},{
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

export const  getGroupsList  = async  (token,user_name) => {
    try{
        const response = await axios.post(`${groupBaseApi}/get_groups_list`,{},{
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

export const  groupJoinRequest  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/group_join_request`,{...data},{
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

export const  addNewMember  = async  (token,user_name,data) => {
    try{
        const response = await axios.post(`${groupBaseApi}/group_join_request_sent_to_user`,{...data},{
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