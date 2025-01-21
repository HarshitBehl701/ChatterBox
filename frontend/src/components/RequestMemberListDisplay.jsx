import React from "react";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import { ToastContainer } from "react-toastify";
import {manageGroupRequestsByAdmin}  from "../api/group";

function RequestMemberListDisplay({data}) {
  const  handleManageGroupJoinRequest =  async (action)  =>  {
      try{
        const response  =  await  manageGroupRequestsByAdmin(localStorage.getItem('token'),localStorage.getItem('user_name'),{
          groupId:  data.groupId, 
          username:  data.username, 
          newStatus: action
        })

        if(response.status){
          handleSuccess(`Successfully ${action} the join request`)
        }else{
          handleError(response.message);
        }

      }catch(error){
        handleError(error.message);
      }
  }

  return (
    <div className="twoSectionLayout  my-3 flex items-center gap-5  pb-3  border-b border-gray-700">
      <div className="leftSection">
        <img
          src="/src/assets/images/user.jpg"
          alt="user"
          className="w-20 h-20 rounded-full"
        />
      </div>
      <div className="rightSection w-full">
        <div className="twoSectionLayout flex items-center justify-between">
          <div className="leftSection">
            <p className="font-semibold text-sm">{data.username}</p>
          </div>
          <div className="rightSection w-1/3 flex items-center  justify-end  gap-3">
              <button
                className="font-semibold  bg-green-700 hover:bg-green-800 cursor-pointer text-xs rounded-md px-2 py-1"
                onClick={() => {handleManageGroupJoinRequest('accept')}}
               >
                Accept  Join   Request
              </button>
               <button
                className="font-semibold  bg-red-700 hover:bg-red-800 cursor-pointer text-xs rounded-md px-2 py-1"
                onClick={() => {handleManageGroupJoinRequest("rejected")}}
              >
                Reject  Join   Request
              </button>
          </div>
        </div>
      </div>
      <ToastContainer   />
    </div>
  );
}

export default RequestMemberListDisplay;
