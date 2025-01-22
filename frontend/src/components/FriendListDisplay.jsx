import React from "react";
import  {handleError,handleSuccess} from   "../helpers/toastHelpers";
import { Link } from "react-router-dom";
import { manageFriendsList } from "../helpers/userHelpers";

function FriendListDisplay({ friendRequests,friendsList }) {
  const  handleManageFriendList = async  (setStatus,username,id) =>  {
    const  response  = await manageFriendsList(setStatus,username,id);
    if(!response.status){
      handleError(response.message);
    }else{
      handleSuccess(`Successfully change  status to ${setStatus}`);
    }
  }

  return (
    <div>
      <h3 className="my-4  font-semibold text-xl">Friend List</h3>
      {Array.isArray(friendRequests)  &&  friendRequests.length  >  0 &&  <p  className="font-semibold">Requests</p>}
      <ul className="h-[230px] overflow-y-auto p-3 scrollbar-hidden">
        {Array.isArray(friendRequests)  &&  friendRequests.length  >  0 &&  friendRequests.map((val, index) => (
          <li  key={index} className="p-3 border-b  border-gray-800">
            <div className="twoSection flex items-center gap-4">
              <div className="leftSection  w-24">
                <img
                  src={(val?.request_sent_by_user_id?.picture  && `/src/assets/images/profilePicture/${val?.request_sent_by_user_id?.picture}`) ?? "/src/assets/images/user.jpg"}
                  alt="userProfile"
                  className="w-20 h-20 rounded-full   object-cover"
                />
              </div>
              <div className="rightSection  w-full">
                <div className="twoSectionLayout  flex items-center  justify-between">
                  <div className="leftSuid">
                    <p>{val?.request_sent_by_user_id?.name}</p>
                    <p>{val?.request_sent_by_user_id?.username}</p>
                  </div>
                  <div className="rightSide">
                    {val.status == "request" && (
                      <button className="px-2  py-1 rounded-md text-sm bg-green-700  hover:bg-green-800 cursor-pointer font-semibold"   onClick={()  => {handleManageFriendList('accepted',val.request_sent_by_user_id.username,val._id)}}>
                        Accept Friend Request
                      </button>
                    )}
                    {val.status == "request" && (
                      <button className="px-2  py-1 rounded-md ml-3 text-sm bg-red-600  hover:bg-red-700 cursor-pointer font-semibold"   onClick={()  => {handleManageFriendList('rejected',val.request_sent_by_user_id.username,val._id)}}>
                        Cancel Friend Request
                      </button>
                    )}
                    {val.status == "accepted" && (
                      <button className="px-2  py-1 rounded-md ml-3 text-sm bg-gray-600  hover:bg-gray-700 cursor-pointer font-semibold"   onClick={()  => {handleManageFriendList('rejected',val.request_sent_by_user_id.username,val._id)}}>
                        Remove Friend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}

        {Array.isArray(friendsList)  &&  friendsList.length  >  0   && friendsList.map((val, index) => (
          <Link  to={`/chat/${encodeURIComponent(val?.friendDetails?.username)}`}  key={index}>
          <li className="p-3 border-b  border-gray-800">
            <div className="twoSection flex items-center gap-4">
              <div className="leftSection  w-24">
                <img
                  src={(val?.friendDetails?.picture && `/src/assets/images/profilePicture/${val?.friendDetails?.picture}`) ?? "/src/assets/images/user.jpg"}
                  alt="userProfile"
                  className="w-20 h-20 rounded-full   object-cover"
                />
              </div>
              <div className="rightSection  w-full">
                <div className="twoSectionLayout  flex items-center  justify-between">
                  <div className="leftSuid">
                    <p>{val?.friendDetails?.name}</p>
                    <p>{val?.friendDetails?.username}</p>
                  </div>
                  <div className="rightSide">
                  <button className="px-2  py-1 rounded-md ml-3 text-sm bg-gray-600  hover:bg-gray-700 cursor-pointer font-semibold"   onClick={()  => {handleManageFriendList('rejected',val?.friendDetails?.username,val.id)}}>
                        Remove Friend
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default FriendListDisplay;
