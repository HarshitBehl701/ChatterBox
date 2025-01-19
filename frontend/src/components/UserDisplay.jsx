import React from "react";
import { Link } from "react-router-dom";

function UserDisplay({data,status}) {
  return (
    <Link to={`/chat/${encodeURIComponent(data.username)}`}>
    <div className="userCont shrink-0 relative flex flex-col  items-center justify-center">
      <img
        src={data.picture  ?? "/src/assets/images/user.jpg"}
        alt="user"
        className="w-20  h-20 rounded-full  border-2  border-gray-400"
      />
      <p className="font-semibold  text-xs">{data.name}</p>
      <div className={status  ==  'online'  ? "smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-green-400 border-gray-700  border-2" :"smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-gray-400 border-gray-700  border-2"}></div>
    </div>
    </Link>
  );
}

export default UserDisplay;
