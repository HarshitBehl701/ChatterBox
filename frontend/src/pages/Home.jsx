import React, { useEffect, useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import UserChatRow from '../components/UserChatRow'
import UsersDisplayRow from '../components/UsersDisplayRow'
import SearchChat from '../components/SearchChat'
import   {getUserFriendsList}  from "../api/user";
import { useLocation } from 'react-router-dom'

function Home() {
  const [friendsListData,setFriendsListData] = useState([]);
  const [previousChatsList,setPreviousChatsList] =  useState([]);
  const location   = useLocation();
  const [userChats,setUserChats] =  useState([]);

  useEffect(()  =>  {

    const main  =  async  ()  => {
        try{
          const friendsListResponse = await getUserFriendsList(localStorage.getItem('token'),localStorage.getItem('user_name'));
          if(friendsListResponse.status){
            setFriendsListData(friendsListResponse.data);
            setUserChats(friendsListResponse.data);
            setPreviousChatsList(friendsListResponse.data)
          }
        }catch(error){
          console.log(error.message);
        }
    }

    main();

  },[location]);

  return (
    <>
    <BaseLayout>
    <UsersDisplayRow friendsListData={friendsListData}  />
    <div className="header  flex items-center justify-between">
    <h2 className='font-semibold text-2xl'>Chats</h2>
    <SearchChat previousChatsList={previousChatsList}  userChats={userChats} setUserChats={setUserChats} />
    </div>
    <div className="userChatCont  h-[60vh] py-6 overflow-y-auto scrollbar-hidden scrollbar-hidden">
      {userChats.map((val,index)  => <UserChatRow  key={index} data={val} />)}
    </div>
    </BaseLayout>
    </>
  )
}

export default Home