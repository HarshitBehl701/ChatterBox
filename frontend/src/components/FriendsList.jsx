import React from "react";

function FriendsList() {
  return (
    <li>
      <div className="twoSectionLayout mb-3   pb-2  border-b  border-gray-400  flex  items-center justify-between">
        <div className="leftSection flex  gap-3 items-center">
          <img
            src="/assets/images/user.jpg"
            alt="user"
            className="w-10 h-10  rounded-full"
          />
          <div className="detailSection">
            <p className="font-semibold text-sm">Name</p>
            <p className="text-xs">username</p>
          </div>
        </div>
        <div className="rightSection">
          <button className="px-2  py-1 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>
    </li>
  );
}

export default FriendsList;
