import React from "react";
import UserDisplay from "./UserDisplay";

function UsersDisplayRow({friendsListData}) {
  return (
    <div className="userDisplaySection bg-black mb-5 border-b border-gray-600 p-3">
      <div className="userSliderContainer relative">
        <div className="flex gap-8 overflow-x-auto scrollbar-hidden">
          {friendsListData.map((val,index) =>  <UserDisplay key={index} data={val} status={val.status} />)}
        </div>
      </div>
    </div>
  );
}

export default UsersDisplayRow;
