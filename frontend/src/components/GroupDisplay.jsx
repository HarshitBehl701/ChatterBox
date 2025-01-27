import React from 'react'
import { Link } from "react-router-dom";
import  {getPicturePath}  from  "../helpers/commonHelper";

function GroupDisplay({data}) {
  return (
    <Link to={`/group_chat/${encodeURIComponent(data?.groupName)}`}>
    <div className="userCont shrink-0 relative flex flex-col  items-center justify-center">
      <div className="relative">
      <img
        src={(data?.groupPicture &&  getPicturePath(data?.groupPicture,'group')) ||   getPicturePath()}
        alt="user"
        className="w-20  h-20 rounded-full  border-2  border-gray-400"
      />
      <div className={data?.status == 'active' ? "smallDot w-3  h-3  rounded-full absolute bottom-2 right-1 bg-green-400 border-gray-700  border-2" :"smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-gray-400 border-gray-700  border-2"}></div>
      </div>
      <p className="font-semibold  text-xs">{data?.groupName}</p>
      
    </div>
    </Link>
  )
}

export default GroupDisplay