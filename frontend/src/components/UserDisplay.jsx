import React from "react";
import { Link } from "react-router-dom";
import  {getPicturePath} from "../helpers/commonHelper";

function UserDisplay({data,status}) {
  return (
    <Link to={`/chat/${encodeURIComponent(data.username)}`}>
    <div className="userCont shrink-0 relative flex flex-col  items-center justify-center">
      <div className="relative">
      <img
        src={(data.picture   && getPicturePath(data.picture,'user'))  ?? getPicturePath()}
        alt="user"
        className="w-20  h-20 rounded-full object-cover border-2  border-gray-400"
      />
      <div className={status  ==  'online'  ? "smallDot w-3  h-3  rounded-full absolute bottom-2 right-1 bg-green-400 border-gray-700  border-2" :"smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-gray-400 border-gray-700  border-2"}></div>
      </div>
      <p className="font-semibold  text-xs">{data.name}</p>
    </div>
    </Link>
  );
}

export default UserDisplay;
