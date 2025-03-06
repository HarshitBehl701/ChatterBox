import React, { ReactNode } from "react";
import { IFriendRequestModal, IGroupModal, IGroupRequestsModal, IUserModal } from "./commonInterface";
import { Socket } from "socket.io-client";

export interface IUserContext{
    isLoggedIn: boolean  | null;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean  | null>>;
    userData: IUserModal   | null;
    setUserData: React.Dispatch<React.SetStateAction<IUserModal  | null>>;
    userAllFriendsRequests: IFriendRequestModal[]   | null;
    setUserAllFriendsRequests: React.Dispatch<React.SetStateAction<IFriendRequestModal[]  | null>>;
    usersAllGroups: IGroupModal[]   | null;
    setUsersAllGroups: React.Dispatch<React.SetStateAction<IGroupModal[]  | null>>;
    userAllGroupsRequests: IGroupRequestsModal[]   | null;
    setUserAllGroupsRequests: React.Dispatch<React.SetStateAction<IGroupRequestsModal[]  | null>>;
}

export  interface  IUserContextProviderParam   extends IUserContext{
    children:React.ReactNode;
}

export interface IUtilsContext{
    isUserInFriendList: (user_id:string)  => boolean;
    isFriendRequestPending: (user_id:string)  => Promise<IFriendRequestModal |null>;
    isUserAGroupMember: (group:IGroupModal,user_id?:string)  => boolean;
    isUserGroupJoinRequestPending: (group_id:string)  => Promise<IGroupRequestsModal |null>;
    sendFriendRequest: (user_id:string)  => Promise<void>;
    manageFriendRequest: (request:IFriendRequestModal,action: "accepted" | "rejected")  => Promise<void>;
    manageGroupRequestForAdmin: (request:IGroupRequestsModal,action: "accepted" | "rejected")  => Promise<void>;
    manageGroupRequestForUser: (request:IGroupRequestsModal,action: "accepted" | "rejected")  => Promise<void>;
    removeFriendfn: (user_id:string)  => Promise<void>;
    sendGroupJoinRequest: (group_id:string)  => Promise<void>;
}

export   interface IUtilsContextProviderParam{
    children:React.ReactNode;
}

export  interface ISocketContext{
    sendUserMessage: (message:string,user:IUserModal) => void;
    joinGroup: (group:IGroupModal) => void;
    sendGroupMessage: (message:string,groupData:IGroupModal) => void;
    socket:Socket | null;
    newMessageReceived:{
        from:   IUserModal;
        to: IGroupModal | IUserModal;
        message: string;
    } | null,
    setNewMessageReceived: React.Dispatch<React.SetStateAction<ISocketContext['newMessageReceived'] | null>>;
    currentPage:string   | null
    setCurrentPage:React.Dispatch<React.SetStateAction<string|null>>;
}

export interface ISocketContextProvider{
    children:ReactNode;
}