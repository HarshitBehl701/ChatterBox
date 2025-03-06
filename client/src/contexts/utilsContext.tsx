import { IFriendRequestModal, IGroupModal, IGroupRequestsModal } from "@/interfaces/commonInterface";
import { IUtilsContext, IUtilsContextProviderParam } from "@/interfaces/contextInterface";
import  {createContext, useCallback, useContext} from "react";
import { useUserContext } from "./userContext";
import { handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { addFriend, getUserAllFriendsRequests, manageUserFriendRequest, removeFriend } from "@/api/userApi";
import { IGetUserAllFriendsRequestsResponse, IGetUserAllGroupsJoinRequestsResponse } from "@/interfaces/apiInterfaces";
import { getUserAllGroupsJoinRequests, makeGroupJoinRequest, manageGroupRequestsByAdmin, manageGroupRequestsByUser } from "@/api/groupApi";
import { ToastContainer } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export  const  UtilsContext  = createContext<IUtilsContext | null>(null);

export  const UtilsContextProvider   =  ({children}:IUtilsContextProviderParam) =>  {
    const {userData,userAllFriendsRequests,setUserAllFriendsRequests,userAllGroupsRequests,setUserAllGroupsRequests} = useUserContext();

    const isUserInFriendList =  useCallback((user_id:string):boolean => {
        if(userData) 
        {
            userData.friendsList.forEach((data) =>  {
                if(data._id.includes(user_id)) return  true
            });
        }
        return false;
    },[userData])

    const isFriendRequestPending =   useCallback(async(user_id:string):Promise<IFriendRequestModal |null> =>{
        if(userData)
        {
            if(userAllFriendsRequests){
                userAllFriendsRequests.forEach((request) => {if(request.request_sent_by_user_id._id ==  user_id ||  request.request_sent_to_user_id._id ==  user_id) return request  } )
            }else{
                try {
                    const response = await  getUserAllFriendsRequests();
                    if(response.status)
                    {
                        const responseData   =  (response.data as  IGetUserAllFriendsRequestsResponse).requests;
                        responseData.forEach((request) => {if(request.request_sent_by_user_id._id ==  user_id ||  request.request_sent_to_user_id._id ==  user_id) return request  } )
                        setUserAllFriendsRequests(responseData);
                    } else{
                        throw  new  Error(response.message);
                    }
                } catch (error) {
                    throw  new  Error(handleCatchErrors(error));
                }
            }
        }
        return  null;
    },[userData,setUserAllFriendsRequests,userAllFriendsRequests])

    const isUserAGroupMember =   useCallback((group:IGroupModal,user_id?:string):boolean =>{
        let isGroupMember  =  false;
        if(userData)
        {
            group.members.forEach(member => {
                if(member._id.includes(user_id as string))
                    isGroupMember =  true;
            });
        }
        return  isGroupMember;
    },[userData]) 

    const isUserGroupJoinRequestPending =   useCallback(async(group_id:string):Promise<IGroupRequestsModal |null>=>{
        if(userData)
        {
            if(userAllGroupsRequests)
            {
                userAllGroupsRequests.forEach((request) =>  {if(request.groupId._id === group_id) return  request});
            }else{
                try {
                    const response  = await getUserAllGroupsJoinRequests();
                    if(response.status)
                    {
                        const responseData = (response.data  as  IGetUserAllGroupsJoinRequestsResponse).groupJoinRequests
                        responseData.forEach((request) =>  {if(request.groupId._id === group_id) return  request});
                        setUserAllGroupsRequests(responseData);
                    }else
                        throw  new Error(response.message);
                } catch (error) {
                    throw  new  Error(handleCatchErrors(error));
                }
            }
        }
        return null;
    },[userData,setUserAllGroupsRequests,userAllGroupsRequests]) 

    const sendFriendRequest = useCallback(async (user_id:string):Promise<void> => {
        if (userData) {
          try {
            const response = await addFriend({ friend_id: user_id });
            if (response.status) {
              handleToastPopup({
                message: "Successfully  send friend request",
                type: "success",
              });
              setTimeout(() => window.history.back(), 1000);
            } else handleToastPopup({ message: response.message, type: "error" });
          } catch (error) {
            handleToastPopup({ message: handleCatchErrors(error), type: "error" });
          }
        }
    }, [userData])

    const manageFriendRequest = useCallback(async (request:IFriendRequestModal,action: "accepted" | "rejected"):Promise<void> => {
        if (request && userData) {
        try {
            const response = await manageUserFriendRequest({request_id: request._id,newStatus: action});
            if (response.status) {
            handleToastPopup({
                message: `Successfully ${action} friend  Request`,
                type: "success",
            });
            setTimeout(() => window.history.back(), 1000);
            } else handleToastPopup({ message: response.message, type: "error" });
        } catch (error) {
            handleToastPopup({
            message: handleCatchErrors(error),
            type: "error",
            });
        }
        }
    },[userData]);
    
    const removeFriendfn = useCallback(async (user_id:string):Promise<void> => {
        if (userData  &&   (await  isUserInFriendList(user_id))) {
            try {
            const response = await  removeFriend({friend_id:user_id});
            if (response.status) {
                handleToastPopup({
                message: `Successfully Removed Friend`,
                type: "success",
                });
                setTimeout(() => window.history.back(), 1000);
            } else handleToastPopup({ message: response.message, type: "error" });
            } catch (error) {
            handleToastPopup({
                message: handleCatchErrors(error),
                type: "error",
            });
            }
        }
    },[userData,isUserInFriendList]);

    const sendGroupJoinRequest  =  useCallback(async(group_id:string):Promise<void> => {
        if(userData)
        {
          try {
            const  response =  await makeGroupJoinRequest({groupId:group_id});
    
            if(response.status)
            {
              handleToastPopup({message:"Successfully Send  Join Request",type:'success'});
              setTimeout(() =>   window.location.reload(),1000);
            }else
              handleToastPopup({message:(response.message),type:'error'});
    
          } catch (error) {
            handleToastPopup({message:handleCatchErrors(error),type:'error'});
          }
        }
    },[userData]);

    const manageGroupRequestForUser = useCallback(async (request:IGroupRequestsModal,action: "accepted" | "rejected"):Promise<void> => {
        if (request && userData) {
        try {
            const response = await manageGroupRequestsByUser({requestId: request._id,groupId:request.groupId._id,status:action});
            if (response.status) {
            handleToastPopup({
                message: `Successfully ${action} Group  Request`,
                type: "success",
            });
            setTimeout(() => window.location.reload(), 1000);
            } else handleToastPopup({ message: response.message, type: "error" });
        } catch (error) {
            handleToastPopup({
            message: handleCatchErrors(error),
            type: "error",
            });
        }
        }
    },[userData]);

    const manageGroupRequestForAdmin = useCallback(async (request:IGroupRequestsModal,action: "accepted" | "rejected"):Promise<void> => {
        if (request && userData) {
        try {
            const response = await manageGroupRequestsByAdmin({requestId: request._id,groupId:request.groupId._id,status:action});
            if (response.status) {
            handleToastPopup({
                message: `Successfully ${action} Group  Request`,
                type: "success",
            });
            setTimeout(() => window.location.reload(), 1000);
            } else handleToastPopup({ message: response.message, type: "error" });
        } catch (error) {
            handleToastPopup({
            message: handleCatchErrors(error),
            type: "error",
            });
        }
        }
    },[userData]);

    return (
        <UtilsContext.Provider value={{isUserInFriendList,isFriendRequestPending,isUserAGroupMember,isUserGroupJoinRequestPending,sendFriendRequest,manageFriendRequest,removeFriendfn,sendGroupJoinRequest,manageGroupRequestForAdmin,manageGroupRequestForUser}}>
            {children}
            <ToastContainer />
        </UtilsContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUtilsContext  = () =>  {
    const  context =  useContext(UtilsContext);
    if(!context)
        throw new Error('Utils Context  Not  Found');
    return  context;
}