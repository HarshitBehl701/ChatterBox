import { IAddFriend, IGetChats, ILoginUser, IManageUserFriendRequest, IRegisterUser, IRemoveFriend, IUpdateUser } from "@/interfaces/apiInterfaces";
import { apiInstance, handleApiResponse, handleCatchErrorsOfApi, userRouters } from "./baseApi";
import { AxiosResponse } from "axios";

const axiosApi  = apiInstance('user');

export const register = async (data:IRegisterUser)  => {
    try {
        const response = await axiosApi.post(userRouters['register'],{...data}) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const login = async (data:ILoginUser)  => {
    try {
        const response = await axiosApi.post(userRouters['login'],{...data}) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const logout = async ()  => {
    try {
        const response = await axiosApi.post(userRouters['logout']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getUserDetails = async ()  => {
    try {
        const response = await axiosApi.post(userRouters['getUserDetails']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const updateUserDetails = async (data:IUpdateUser)  => {
    try {
        const formData = new FormData();

        if(data.name)
            formData.append("name",data.name);

        if(data.username)
            formData.append("username",data.username);

        if(data.email)
            formData.append("email",data.email);

        if(data.password)
            formData.append("password",data.password);

        if(data.status)
            formData.append("status",data.status);
        
        if(data.profilePicture)
            formData.append("profilePicture",data.profilePicture);
        
        if(data.is_active)
            formData.append("is_active",data.is_active.toString());


        const response = await axiosApi.post(userRouters['updateUser'],formData) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getAllActiveUsers = async ()  => {
    try {
        const response = await axiosApi.post(userRouters['getAllActiveUsers']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const manageUserFriendRequest = async (data:IManageUserFriendRequest)  => {
    try {
        const response = await axiosApi.post(userRouters['manageFriendRequest'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getUserAllGroups = async ()  => {
    try {
        const response = await axiosApi.post(userRouters['getUserAllGroups']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const removeFriend = async (data:IRemoveFriend)  => {
    try {
        const response = await axiosApi.post(userRouters['removeFriend'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const addFriend  = async (data:IAddFriend)  => {
    try {
        const response = await axiosApi.post(userRouters['addFriend'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getUserChats = async (data:IGetChats)  => {
    try {
        const response = await axiosApi.post(userRouters['getUserChats'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getUserAllFriendsRequests = async ()  => {
    try {
        const response = await axiosApi.post(userRouters['getUserAllFriendsRequests']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}