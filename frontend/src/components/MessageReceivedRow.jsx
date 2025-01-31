import React from "react";
import {getPicturePath}  from "../helpers/commonHelper";

function MessageReceivedRow({message,profilePicture}) {
  return (
    <div className="flex gap-4 items-start  my-2">
      <img
        src={(profilePicture &&  getPicturePath(profilePicture,'user')) || getPicturePath()}
        alt="user"
        className="w-12 h-12 rounded-full"
      />
      <div className="relative bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs shadow-md">
        <p className="break-words">
          {message}
        </p>
        <div className="absolute top-3 left-[-8px] w-4 h-4 bg-gray-100 rotate-45"></div>
      </div>
    </div>
  );
}

export default MessageReceivedRow;
