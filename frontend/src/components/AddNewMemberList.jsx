import React from 'react'
import { handleError, handleSuccess } from '../helpers/toastHelpers';
import { addMemberToGroup } from '../helpers/groupHelpers';
import { getPicturePath } from '../helpers/commonHelper';

function AddNewMemberList({picture,name,username,groupName}) {
    
    const  handleAddNewMember = async  () => {
        if (window.confirm(`Are you sure you  want to send ${groupName} join  request to ${username}`)) {
            const  response = await addMemberToGroup(username,groupName);
            if(response.status){
                handleSuccess("Successfully Sent join  request");
                setTimeout(() => {window.location.reload()},1000);
            }else{
                handleError(response.message)
            }
        }
    }

  return (
    <div className="userCont shrink-0 relative flex items-center gap-3  pb-2  border-b border-gray-500  mb-2  px-2">
      <img
        src={(picture   && getPicturePath(picture,'user'))  ?? getPicturePath()}
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
    </div>
  )
}

export default AddNewMemberList