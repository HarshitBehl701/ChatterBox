import React from "react";
import  {Link} from  "react-router-dom";

function UserChatRow() {
  return (
    <Link  to={'/chat'}>
    <div className="twoSectionLayout border-b mb-4 border-gray-700 pb-2  flex gap-5">
      <div className="leftSection w-24">
        <img
          src="/assets/images/user.jpg"
          alt="userimage"
          className="w-20 h-20 rounded-full border-2 border-gray-600"
        />
      </div>
      <div className="rightSection  w-full  pt-2 pr-4">
        <div className="twoSection  flex">
          <div className="leftSection w-full">
            <h3 className="font-semibold text-sm">Full Name</h3>
            <p className="text-sm mt-2">Message</p>
          </div>
          <div className="rightSection">
            <p className="text-sm">Active</p>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default UserChatRow;
