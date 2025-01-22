import React from "react";
import { handleError } from "../helpers/toastHelpers";

function FriendsList({picture,name,username,setMembersFn,currentMembers,isGroupNameSet}) {

  const  handleAddMemberOrRemoveMemberBtn  = (ev) => {
    ev.preventDefault();
    if(isGroupNameSet){
      const  previousMembers = [...currentMembers];
      const userExistsInMembersList  = previousMembers.indexOf(username);
      if(userExistsInMembersList  !== -1){
        previousMembers.splice(userExistsInMembersList,1);
      }else{
        previousMembers.push(username);
      }
      setMembersFn(previousMembers);
    }else{
      handleError('Please  Set  Group Name  First')
    }
  }

  return (
    <li>
      <div className="twoSectionLayout mb-3   pb-2  border-b  border-gray-400  flex  items-center justify-between">
        <div className="leftSection flex  gap-3 items-center">
          <img
            src={(picture &&  `/src/assets/images/profilePicture/${picture}`)  || "/src/assets/images/user.jpg"}
            alt="user"
            className="w-10 h-10  rounded-full  object-cover"
          />
          <div className="detailSection">
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs">{username}</p>
          </div>
        </div>
        <div className="rightSection">
          <button className="px-2  py-1 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700" onClick={(ev) =>   {handleAddMemberOrRemoveMemberBtn(ev)}}>
            {currentMembers.indexOf(username)  !== -1  ? 'Remove' :  'Add'}
          </button>
        </div>
      </div>
    </li>
  );
}

export default FriendsList;
