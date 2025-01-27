import React, { useEffect, useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import GroupDisplayRow from '../components/GroupDisplayRow'
import SearchGroup from '../components/SearchGroup'
import GroupRow from "../components/GroupRow";
import { handleError } from '../helpers/toastHelpers';
import JoinGroupPopup from '../components/JoinGroupPopup';
import CreateGroupPopup from '../components/CreateGroupPopup';
import { getGroupAllIncomingRequestsUserGetsFromGroupAdmin } from '../helpers/groupHelpers';
import { getUsersJoinGroupsList } from '../helpers/userHelpers';
import { ToastContainer } from 'react-toastify';

function Groups() {
  const [isGroupCreatePoupOpen,setIsGroupCreatePoupOpen] = useState(false)
  const [isGroupJoinPopupOpen,setIsGroupJoinPopupOpen] = useState(false)
  const [groupRequests,setGroupRequests] = useState([]);
  const [userGroups,setUserGroups]  =  useState([]);
  const [filterGroups,setFilterGroups] = useState([]);

  useEffect(() => {
    
    const main   =  async  () => {
        const groupRequestsReceived  = await  getGroupAllIncomingRequestsUserGetsFromGroupAdmin();
        const  userAllGroupsResponse  = await getUsersJoinGroupsList();

        if(groupRequestsReceived.status){
          setGroupRequests(groupRequestsReceived.data);
        }else{
          handleError(groupRequestsReceived.message);
        }

        if(userAllGroupsResponse.status){
          setUserGroups(userAllGroupsResponse.data);
          setFilterGroups(userAllGroupsResponse.data);
        }else{
          handleError(userAllGroupsResponse.message);
        }
    }

    main();

  },[]);

  return (
    <BaseLayout>
    <GroupDisplayRow userGroups={userGroups} />
    <div className="header  flex items-center justify-between  flex-wrap">
    <h2 className='font-semibold text-2xl'>Groups</h2>
    <SearchGroup setFilterGroups={setFilterGroups} currentGroups={userGroups} />
    </div>
    <button  className='font-semibold text-xs px-2 py-1 rounded-md  bg-gray-600'  onClick={() =>  {setIsGroupCreatePoupOpen(true)}}>Create  New  Group  +</button>
    <button  className='font-semibold text-xs ml-4 px-2 py-1 rounded-md  bg-green-700  hover:bg-green-800'  onClick={() =>  {setIsGroupJoinPopupOpen(true)}}>Join  Group</button>
    <div className="groupRowsCont h-[60vh] py-6 overflow-y-auto scrollbar-hidden scrollbar-hidden">
    {groupRequests.length > 0 && <h2   className='font-semibold   mb-2'>Requests</h2>}
    {groupRequests.map((val,index) =>  <GroupRow isRequestRow={true}  data={val} key={index} />)}
    
    {filterGroups.map((val,index) => <GroupRow key={index} data={val}  isRequestRow={false} />)}

    </div>
    {isGroupCreatePoupOpen && <CreateGroupPopup setIsGroupCreatePoupOpen={setIsGroupCreatePoupOpen} />}
    {isGroupJoinPopupOpen && <JoinGroupPopup setIsGroupJoinPopupOpen={setIsGroupJoinPopupOpen} />}
    <ToastContainer  />
    </BaseLayout>
  )
}

export default Groups