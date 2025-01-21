import React from "react";
import  {ToastContainer} from "react-toastify";
import { handleError,handleSuccess } from "../helpers/toastHelpers";
import  {groupJoinRequest} from "../api/group";

function GroupsList({data}) {
    const addGroupJoinRequestBtnEvent  = async (e) =>  {
        e.preventDefault();
        try{
            const response = await groupJoinRequest(localStorage.getItem('token'),localStorage.getItem('user_name'),{
                groupName: data.name,
                groupId: data._id
            })

            if(response.status){
                handleSuccess(`Join  Request  Send  Successfully for ${data.name} group`)
                setTimeout(() =>{window.location.reload()},1000);
            }else{
                handleError(response.message)
            }

        }catch(error){
            handleError(error.message)
        }
    }

  return (
    <li>
      <div className="twoSectionLayout mb-3   pb-2  border-b  border-gray-400  flex  items-center justify-between">
        <div className="leftSection flex  gap-3 items-center">
          <img
            src={(data.picture  && `/src/assets/images/groupPicture/${data.picture}`) || "/src/assets/images/user.jpg"}
            alt="user"
            className="w-10 h-10  rounded-full"
          />
          <div className="detailSection">
            <p className="font-semibold text-sm">{data.name}</p>
          </div>
        </div>
        <div className="rightSection">
          <button   className="text-xs  px-2  py-1 rounded-md bg-blue-600 hover:bg-blue-700  font-semibold" onClick={(e)=> {addGroupJoinRequestBtnEvent(e)}}>Add Join    Request</button>
        </div>
      </div>
      <ToastContainer />
    </li>
  )
}

export default GroupsList