import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import BaseLayout from "../layouts/BaseLayout";
import  {Link, useLocation}   from  "react-router-dom";
import  {ToastContainer} from "react-toastify";
import  {handleError, handleSuccess} from "../helpers/toastHelpers";
import  {getOwnProfileDetails,getOtherUserProfile,addFriend}  from "../api/user";
import FriendListDisplay from '../components/FriendListDisplay';

function Profile() {
  const  {username} = useParams();
  const currentUserName = localStorage.getItem('username');

  const location  =  useLocation();

  const [userData,setUserData] =  useState({});

  useEffect(()=> {

    const main  = async  ()  =>  {
      try{
        const response =  username ? await getOtherUserProfile(localStorage.getItem('token'),localStorage.getItem('user_name'),username) : await getOwnProfileDetails(localStorage.getItem('token'),localStorage.getItem('user_name'));
        if(response.status){
          setUserData(response.data);
        }else{
          handleError(response.message);
        }

      }catch(error){
        handleError(error.message)
      }
    }
    main();

  },[location])

  const handleAddFriend = async () => {
    if(username   !== currentUserName){
      try{
        const response = await addFriend(localStorage.getItem('token'),localStorage.getItem('user_name'),{
          request_sent_to_user_username:  userData.username
        });
        if(response.status){
          handleSuccess('Friend Request  Sent');
          setTimeout(() => {window.location.reload()},1000);
        }else{
          handleError(response.message);
        }
      }catch(error){
        handleError(error.message);
      }
    }else{
      handleError("Some Unexpected Error Occured");
    }
  }

  return (
    <>
    <BaseLayout>
        <h1 className='mb-4  font-semibold text-2xl'>User Profile</h1>
        <div className="twoSectionLayout flex gap-5 flex-wrap">
            <div className="leftSection">
                <img src="/src/assets/images/user.jpg" alt="user"  className='w-44  h-44 border-4  border-gray-700  rounded-full' />
            </div>
            <div className="rightSection  pt-4 md:pl-4">
                <h2 className='text-xl  mb-1'>{userData?.name}</h2>
                <h3 className='mb-1'>{userData?.username}</h3>
                <p  className='mb-1'>{userData?.email}</p>

                {currentUserName !== username && (userData?.friendStatus == false ||  userData?.friendStatus == 'rejected') &&
                  <button onClick={handleAddFriend} className='px-2  py-1 text-sm   rounded-lg  mt-1 inline-block  bg-blue-600  hover:bg-blue-700 text-white  font-semibold'>{userData?.friendStatus !=  false &&  userData?.friendStatus !=  'rejected' ? userData.friendStatus : 'Add to friend  List'}</button>
                }

                {currentUserName !== username && (userData?.friendStatus == false ||  userData?.friendStatus !== 'rejected') &&
                  <p  className='mb-1'>{userData?.friendStatus}</p>
                }


            </div>
        </div>
        <br />
        {userData?.friendRequestReceived  && <div><hr className='border border-gray-800' />
          <FriendListDisplay friendRequests={userData.friendRequestReceived} friendsList={userData.friendsList} /></div>}

        <ToastContainer  />
    </BaseLayout>
    </>
  )
}

export default Profile