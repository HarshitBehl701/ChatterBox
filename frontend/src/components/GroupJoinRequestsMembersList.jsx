import React, { useEffect, useState } from 'react'
import { handleError } from '../helpers/toastHelpers';
import RequestMemberListDisplay from './RequestMemberListDisplay';
import { getGroupAllIncomingRequestsComesFromUser } from '../helpers/groupHelpers';

function GroupJoinRequestsMembersList({groupName}) {
    const [joinRequestUsers,setJoinRequestUsers]  = useState([]);

    useEffect(() => {
        const main = async  () =>  {
            const response  =  await getGroupAllIncomingRequestsComesFromUser(groupName);
            if(response.status){
                setJoinRequestUsers(response.data)
            }else{
                handleError(response.message)
            }
        }
        main();
    },[]);

  return (
    <div>
        {joinRequestUsers.map((val,index) => <RequestMemberListDisplay key={index} data={val} />)}
    </div>
  )
}

export default GroupJoinRequestsMembersList