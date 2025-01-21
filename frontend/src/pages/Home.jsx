import React, { useEffect, useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import UserChatRow from '../components/UserChatRow'
import UsersDisplayRow from '../components/UsersDisplayRow'
import SearchChat from '../components/SearchChat'
import   {getUserFriendsList}  from "../api/user";
import { useLocation } from 'react-router-dom';
import   {ToastContainer}  from 'react-toastify';
import {handleError}  from "../helpers/toastHelpers";

function Home() {
  const [friendsListData,setFriendsListData] = useState([]);
  const location   = useLocation();
  const [userChats,setUserChats] =  useState([]);
  const [previousChats,setPreviousChats] =  useState([]);

  useEffect(()  =>  {

    const main  =  async  ()  => {
        try{
          const friendsListResponse = await getUserFriendsList(localStorage.getItem('token'),localStorage.getItem('user_name'));
          if(friendsListResponse.status){
            setFriendsListData(friendsListResponse.data);
            setUserChats(friendsListResponse.data);
            setPreviousChats(friendsListResponse.data);
          }
        }catch(error){
          handleError(error.message);
        }
    }

    main();

  },[location]);

  return (
    <>
    <BaseLayout>
    <UsersDisplayRow friendsListData={friendsListData}  />
    <div className="header  flex items-center justify-between  flex-wrap">
    <h2 className='font-semibold text-2xl'>Chats</h2>
    <SearchChat previousChats={previousChats} setUserChats={setUserChats} />
    </div>
    <div className="userChatCont  h-[60vh] py-6 overflow-y-auto scrollbar-hidden scrollbar-hidden">
      {userChats.map((val,index)  => <UserChatRow  key={index} data={val} />)}
      {userChats.length  == 0  && <p  className='italic font-light'>No Chats...</p>}
    </div>
    </BaseLayout>
    </>
  )
}

export default Home