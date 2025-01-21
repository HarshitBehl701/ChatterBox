import React from 'react'
import  {addNewMember}  from  "../api/group";
import  {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from '../helpers/toastHelpers';

function AddNewMemberList({picture,name,username,groupName}) {
    
    const  handleAddNewMember = async  () => {
        if (window.confirm(`Are you sure you  want to send ${groupName} join  request to ${username}`)) {
            try{
                const response = await addNewMember(localStorage.getItem('token'),localStorage.getItem('user_name'),{
                    groupName:  groupName,
                    username:  username
                })
                if(response.status){
                    handleSuccess("Successfully Sent join  request");
                    setTimeout(() => {window.location.reload()},1000);
                }else{
                    handleError(response.message)
                }
            }catch(error){
                handleError(error.message)
            }
        }
    }

  return (
    <div className="userCont shrink-0 relative flex items-center gap-3  pb-2  border-b border-gray-500  mb-2  px-2">
      <img
        src={(picture   && `/src/assets/images/profilePicture/${picture}`)  ?? "/src/assets/images/user.jpg"}
        alt="user"
        className="w-16  h-16 rounded-full object-cover border-2  border-gray-400"
      />
      <div className="rightSection  w-full">
      <div className="twoSection flex items-center justify-between">
            <div className="leftSection">
            <p className="font-semibold  text-xs">{name}</p>
            <p className="font-semibold  text-xs">{username}</p>
            </div>
            <div className="rightSection">
                <button  className='px-2  py-1  rounded-md  bg-blue-600 hover:bg-blue-700 text-xs font-semibold' onClick={handleAddNewMember}>Add</button>
            </div>
      </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddNewMemberList