import { IApiResponse } from "@/interfaces/apiInterfaces";
import { handleCatchErrors, unsetLocalStorageVariables } from "@/utils/commonUtils";
import  axios, { AxiosError, AxiosResponse } from "axios";

const baseUrl  =  import.meta.env.VITE_API_BASE_URL;

export  const apiInstance =  (type:string) =>  {
    const instance  = axios.create({
        baseURL:  `${baseUrl}${getApiBaseUrl(type)}`,
        withCredentials: true,
    });
    
    instance.interceptors.response.use((response) => response,(error) => {
        if(error.response && error.response.status === 409)
            unsetLocalStorageVariables();
        return Promise.reject(error);
    })
    
    return instance;
}

export const getApiBaseUrl = (type:string) => {
    const urls:{[key:string]:string} = {
        "user":"/api/v1/user",
        "group":"/api/v1/group",
    }
    return urls[type] ?? baseUrl;
}

export  const handleApiResponse = (response:AxiosResponse) =>{
    const serverResponse = response.data as IApiResponse;
    if('data' in   serverResponse && typeof serverResponse.data ===  'string')
        serverResponse.data = JSON.parse(serverResponse.data);
    return  serverResponse;
}


export const handleCatchErrorsOfApi = (error:unknown) => {
    const   response:{[key:string]:boolean|string} = {status:false,message:handleCatchErrors(error)};
    if(error instanceof  AxiosError &&  error.response && 'data' in error.response)
    {
        return error.response.data;
    }
    return response;
}

export const userRouters:Record<string,string> = {
    'register':'register',   
    'login':'login',   
    'logout':'logout',   
    'getUserDetails':'get_user_details',   
    'updateUser':'update_user',   
    'getAllActiveUsers':'get_all_active_users',   
    'manageFriendRequest':'manage_friend_request',   
    'getUserAllGroups':'get_user_all_groups',   
    'addFriend':'add_friend',   
    'removeFriend':'remove_friend',   
    'getUserChats':'get_user_chats',   
    'getUserAllFriendsRequests':'get_user_all_friends_requests',   
}

export const groupRouters:Record<string,string> = {
    'createGroup':'create_group',   
    'getGroupAllJoinRequestsForAdmin':'get_group_all_join_requests_for_admin',   
    'getUserAllGroupsJoinRequests':'get_group_all_join_requests_for_user',   
    'updateGroup':'update_group',   
    'manageGroupRequestsByAdmin':'manage_group_requests_by_admin',   
    'getGroupChats':'get_group_chats',   
    'makeGroupJoinRequest':'make_group_join_request',   
    'manageGroupRequestsByUser':'manage_group_requests_by_user',   
    'getGroupsList':'get_groups_list',   
}