import React from "react";
import UserDisplay from "./UserDisplay";

function UsersDisplayRow() {
  return (
    <div className="userDisplaySection bg-black mb-5 border-b border-gray-600 p-3">
      <div className="userSliderContainer relative">
        <div className="flex gap-8 overflow-x-auto scrollbar-hidden">
          {Array.from({length: 5}).map((_,index) =>   <UserDisplay key={index} status="online" />)}
          {Array.from({length: 5}).map((_,index) =>   <UserDisplay key={index} status="offline" />)}
        </div>
      </div>
    </div>
  );
}

export default UsersDisplayRow;
