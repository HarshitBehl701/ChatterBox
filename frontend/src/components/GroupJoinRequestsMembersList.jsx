import React, { useEffect, useState } from 'react'
import { getGroupRequestsByUsers } from '../api/group'
import { handleError } from '../helpers/toastHelpers';
import { ToastContainer } from 'react-toastify';
import RequestMemberListDisplay from './RequestMemberListDisplay';

function GroupJoinRequestsMembersList({groupName}) {
    const [joinRequestUsers,setJoinRequestUsers]  = useState([]);

    useEffect(() => {
        const main = async  () =>  {
            try{    
                const  response = await getGroupRequestsByUsers(localStorage.getItem('token'),localStorage.getItem('user_name'),groupName)

                if(response.status){
                    setJoinRequestUsers(response.data)
                }else{
                    handleError(response.message)
                }

            }catch(error){
                handleError(error.message)
            }
        }
        main();
    },[]);

  return (
    <div>
        {joinRequestUsers.map((val,index) => <RequestMemberListDisplay key={index} data={val} />)}
        <ToastContainer  />
    </div>
  )
}

export default GroupJoinRequestsMembersList