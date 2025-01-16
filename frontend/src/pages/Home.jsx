import React, { useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import UserChatRow from '../components/UserChatRow'
import UsersDisplayRow from '../components/UsersDisplayRow'
import SearchChat from '../components/SearchChat'
import AddGroup  from '../components/AddGroup';

function Home() {
  const   [isGroupChatPopupOpen,setIsGroupChatOpen] =  useState(false);
  return (
    <>
    <BaseLayout>
    <UsersDisplayRow />
    <div className="header  flex items-center justify-between">
    <h2 className='font-semibold text-2xl'>Chats</h2>
    <SearchChat />
    </div>
    <div className="subHeader mb-4">
    <button className="text-xs bg-gray-700 px-2  py-1  rounded-lg  font-semibold" onClick={() => setIsGroupChatOpen(true)}>Create New Group Chat</button>
    </div>
    <div className="userChatCont  h-[60vh] py-6 overflow-y-auto scrollbar-hidden scrollbar-hidden">
      <UserChatRow  />
      <UserChatRow  />
      <UserChatRow  />
      <UserChatRow  />
      <UserChatRow  />
    </div>
    <AddGroup  currentStatus={isGroupChatPopupOpen}  closePopup={() => setIsGroupChatOpen(false)}/>
    </BaseLayout>
    </>
  )
}

export default Home