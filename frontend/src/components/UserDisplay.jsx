import React from "react";

function UserDisplay({status}) {
  return (
    <div className="userCont shrink-0 relative flex flex-col  items-center justify-center">
      <img
        src="/assets/images/user.jpg"
        alt="user"
        className="w-20  h-20 rounded-full  border-2  border-gray-400"
      />
      <p className="font-semibold  text-xs">Name</p>
      <div className={status  ==  'online'  ? "smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-green-400 border-gray-700  border-2" :"smallDot w-3  h-3  rounded-full absolute bottom-6 right-2 bg-gray-400 border-gray-700  border-2"}></div>
    </div>
  );
}

export default UserDisplay;
