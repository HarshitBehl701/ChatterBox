import { IUserContext, IUserContextProviderParam } from "@/interfaces/contextInterface";
import  {createContext, useContext} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export  const  UserContext  = createContext<IUserContext | null>(null);

export  const UserContextProvider   =  ({children,isLoggedIn,setIsLoggedIn,userData,setUserData,userAllFriendsRequests,setUserAllFriendsRequests,usersAllGroups,setUsersAllGroups,userAllGroupsRequests,setUserAllGroupsRequests}:IUserContextProviderParam) =>  {
    return (
        <UserContext.Provider value={{isLoggedIn,setIsLoggedIn,userData,setUserData,userAllFriendsRequests,setUserAllFriendsRequests,usersAllGroups,setUsersAllGroups,userAllGroupsRequests,setUserAllGroupsRequests}}>
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext  = () =>  {
    const  context =  useContext(UserContext);
    if(!context)
        throw new Error('User  Context  Not  Found');
    return  context;
}