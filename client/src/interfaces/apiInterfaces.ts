import { IFriendRequestModal, IGroupModal, IGroupRequestsModal, IUserModal } from "./commonInterface";

export  interface  IApiResponse{
    status:boolean;
    message:string;
    data?:unknown;
}

export interface IRegisterUser{
    name:string;
    email:string;
    username:string;
    password:string;
}

export  interface ILoginUser{
    username:string;
    password:string;
}

export  interface IUpdateUser{
    name?:string;
    username?:string;
    email?:string;
    password?:string;
    status?:'online' | 'offline';
    is_active?:0 | 1;
    profilePicture?:File;
}

export  interface   IManageUserFriendRequest{
    request_id:string;
    newStatus:'accepted' | 'rejected';
}

export  interface IRemoveFriend{
    friend_id: string;
}

export  interface IAddFriend{
    friend_id: string;
}

export  interface IGetChats{
    friend_id:string;
}

//===============================================
export   interface  ICreateNewGroup{
    groupName: string;
    members: string;
    groupPicture?: File;
}

export interface  IUpdateGroup{
    group_id: string;
    name?: string;
    adminUserId?: string;
    members?: string;
    status?: 'active'  |  'inactive';
    is_active?: 0 | 1;
    groupPicture?: File;
}

export interface   IGetGroupRequest{
    groupId:string;
}

export interface IManageGroupRequestsByAdmin{
    requestId:string;
    groupId:string;
    status:'accepted'  |  'rejected';
}

export  interface  IManageGroupRequestsByUser{
    requestId:string;
    groupId:string;
    status:'accepted'  |  'rejected';
}

export interface IGetGroupChats{
    group_id:string;
}

export  interface   ILeaveGroup{
    group_id:string;
}

export  interface  IGetGroupJoinRequest{
    groupId:string;
}

//===========================================================
export interface ILoginUserResponse{
    token :  string;
    user: IUserModal;
}

export  interface IGetUserDetailsResponse{
    user:   IUserModal;
}

export  interface IGetUserAllFriendsRequestsResponse{
    requests:   IFriendRequestModal[];
}

export  interface IGetAllGroupsRequestsResponse{
    groupJoinRequests:   IGroupRequestsModal[];
}

export  interface IGetUserAllGroupsResponse{
    groups:IGroupModal[]
}

export  interface  IGetAllGroupsResponse{
    groups:IGroupModal[];
}

export  interface IGetAllActiveUsersResponse{
    users:IUserModal[]
}

export  interface   IGetUserAllGroupsJoinRequestsResponse{
    groupJoinRequests: IGroupRequestsModal[];
}