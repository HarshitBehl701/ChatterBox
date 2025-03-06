import { ICreateNewGroup, IGetGroupChats, IGetGroupRequest, IManageGroupRequestsByAdmin, IManageGroupRequestsByUser, IUpdateGroup } from "@/interfaces/apiInterfaces";
import { apiInstance, groupRouters, handleApiResponse, handleCatchErrorsOfApi } from "./baseApi";
import { AxiosResponse } from "axios";

const axiosApi  = apiInstance('group');

export const createGroup = async (data:ICreateNewGroup)  => {
    try {
        const formData = new FormData();

        formData.append("groupName",data.groupName)
        formData.append("members",data.members)
        
        if(data.groupPicture)
            formData.append("groupPicture",data.groupPicture)

        const response = await axiosApi.post(groupRouters['createGroup'],formData) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getGroupAllJoinRequests = async ()  => {
    try {
        const response = await axiosApi.post(groupRouters['getGroupAllJoinRequestsForAdmin']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getUserAllGroupsJoinRequests = async ()  => {
    try {
        const response = await axiosApi.post(groupRouters['getUserAllGroupsJoinRequests']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const updateGroup = async (data:IUpdateGroup)  => {
    try {

        const formData  = new FormData();

        formData.append('group_id',data.group_id)
        
        if(data.name)
            formData.append('name',data.name)

        if(data.adminUserId)
            formData.append('adminUserId',data.adminUserId)

        if(data.members ||  data.members == '')
            formData.append('members',data.members)
        
        if(data.status)
            formData.append('status',data.status)

        if(data.groupPicture)
            formData.append('groupPicture',data.groupPicture)
        
        if(data.is_active)
            formData.append('is_active',data.is_active.toString())

        const response = await axiosApi.post(groupRouters['updateGroup'],formData) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const manageGroupRequestsByAdmin = async (data:IManageGroupRequestsByAdmin)  => {
    try {
        const response = await axiosApi.post(groupRouters['manageGroupRequestsByAdmin'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getGroupChats = async (data:IGetGroupChats)  => {
    try {
        const response = await axiosApi.post(groupRouters['getGroupChats'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const makeGroupJoinRequest = async (data:IGetGroupRequest)  => {
    try {
        const response = await axiosApi.post(groupRouters['makeGroupJoinRequest'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const manageGroupRequestsByUser = async (data:IManageGroupRequestsByUser)  => {
    try {
        const response = await axiosApi.post(groupRouters['manageGroupRequestsByUser'],data) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}

export const getGroupsList = async ()  => {
    try {
        const response = await axiosApi.post(groupRouters['getGroupsList']) as AxiosResponse;
        return   handleApiResponse(response);
    } catch (error) {
        return  handleCatchErrorsOfApi(error);
    }
}