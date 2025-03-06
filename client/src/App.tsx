import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import BaseLayout from "./layouts/BaseLayout"
import Register from "./pages/Register"
import { useEffect, useState } from "react"
import { IFriendRequestModal, IGroupModal, IGroupRequestsModal, IUserModal } from "./interfaces/commonInterface"
import { UserContextProvider } from "./contexts/userContext"
import { getUserAllFriendsRequests, getUserDetails } from "./api/userApi"
import { IGetUserAllFriendsRequestsResponse, IGetAllGroupsRequestsResponse, IGetUserDetailsResponse } from "./interfaces/apiInterfaces"
import { handleCatchErrors, isUserLoggedIn } from "./utils/commonUtils"
import GroupsList from "./pages/GroupsList"
import UsersList from "./pages/UsersList"
import UserDetails from "./pages/UserDetails"
import { UtilsContextProvider } from "./contexts/utilsContext"
import GroupDetails from "./pages/GroupDetails"
import Chats from "./pages/Chats"
import UserRequests from "./pages/UserRequests"
import GroupRequests from "./pages/GroupRequests"
import { getUserAllGroupsJoinRequests } from "./api/groupApi"
import { SocketContextProvider } from "./contexts/socketContext"

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState<boolean | null>(isUserLoggedIn());
  const [userData,setUserData] = useState<IUserModal | null>(null);
  const [userAllFriendsRequests,setUserAllFriendsRequest] = useState<IFriendRequestModal[] |  null>(null);
  const [usersAllGroups,setUsersAllGroups] = useState<IGroupModal[] |  null>(null);
  const [userAllGroupsRequests,setUserAllGroupsRequests] = useState<IGroupRequestsModal[] |  null>(null);

  useEffect(() => {
    if(isLoggedIn &&  userData  === null)
      {
      ;(async() =>{
        try {
          const response   = await  getUserDetails();
            if(response.status){
              const responseData  = (response.data as IGetUserDetailsResponse);
              setUserData(responseData.user);
              setIsLoggedIn(true);
            }else
            {
              setIsLoggedIn(false);
              throw  new Error(response.message);
            }
            
          } catch (error) {
            setIsLoggedIn(false);
            throw  new Error(handleCatchErrors(error));
          }
      })()
    }
  },[isLoggedIn,userData]);

  useEffect(() => {
    if(isLoggedIn  && userData  &&  userAllFriendsRequests === null)
      {
      ;(async() =>{
        try {
          const response   = await  getUserAllFriendsRequests();
            if(response.status){
              const responseData  = (response.data as IGetUserAllFriendsRequestsResponse);
              setUserAllFriendsRequest(responseData.requests);
            }else
            {
              setUserAllFriendsRequest([]);
              throw  new Error(response.message);
            }
            
          } catch (error) {
            setUserAllFriendsRequest([]);
            throw  new Error(handleCatchErrors(error));
          }
      })()
    }
  },[isLoggedIn,userData,userAllFriendsRequests]);
  
  useEffect(() => {
    if(isLoggedIn  && userData  &&  userAllGroupsRequests === null)
      {
      ;(async() =>{
        try {
          const response   = await  getUserAllGroupsJoinRequests();
            if(response.status){
              const responseData  = (response.data as IGetAllGroupsRequestsResponse);
              setUserAllGroupsRequests(responseData.groupJoinRequests);
            }else
            {
              setUserAllGroupsRequests([]);
              throw  new Error(response.message);
            }
            
          } catch (error) {
            setUserAllGroupsRequests([]);
            throw  new Error(handleCatchErrors(error));
          }
      })()
    }
  },[isLoggedIn,userData,userAllGroupsRequests]);

  return (
    <UserContextProvider isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  userData={userData}  setUserData={setUserData} userAllFriendsRequests={userAllFriendsRequests} setUserAllFriendsRequests={setUserAllFriendsRequest} usersAllGroups={usersAllGroups}  setUsersAllGroups={setUsersAllGroups} userAllGroupsRequests={userAllGroupsRequests} setUserAllGroupsRequests={setUserAllGroupsRequests}>
      <UtilsContextProvider>
        <Routes>
          {isLoggedIn ?
              <>
                  <Route path={'/home'} element={<BaseLayout><Home /></BaseLayout>} />
                  <Route path={'/groups'} element={<BaseLayout><GroupsList /></BaseLayout>} />
                  <Route path={'/users'} element={<BaseLayout><UsersList /></BaseLayout>} />
                  <Route path={'/friend/requests'} element={<BaseLayout><UserRequests /></BaseLayout>} />
                  <Route path={'/group/requests'} element={<BaseLayout><GroupRequests /></BaseLayout>} />
                  <Route path={'/user/:name/details'} element={<BaseLayout><UserDetails /></BaseLayout>} />
                  <Route path={'/group/:name/details'} element={<BaseLayout><GroupDetails /></BaseLayout>} />
                  <Route path={'/:type/:name/chats'} element={<SocketContextProvider><BaseLayout><Chats /></BaseLayout></SocketContextProvider>} />
                  <Route path={'/logout'} element={<Logout />} />
                  <Route path={'/*'} element={<Navigate to={'/home'} />} />
              </>
              : 
              <>
                <Route path={'/login'} element={<Login />} />
                <Route path={'/register'} element={<Register />} />
                <Route path={'/*'} element={<Navigate to={'/login'} />} />
              </>
          }
        </Routes>
      </UtilsContextProvider>
    </UserContextProvider>
  )
}

export default App