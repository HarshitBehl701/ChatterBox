import React from "react";
import  {Link} from  "react-router-dom";
import {getPicturePath} from "../helpers/commonHelper";

function UserFriendDisplayRow({data}) {
  return (
    <Link  to={`/chat/${encodeURIComponent(data.username)}`}>
    <div className="twoSectionLayout border-b mb-4 border-gray-700 pb-2  flex gap-5">
      <div className="leftSection w-24">
        <img
          src={(data.picture  &&  getPicturePath(data.picture,'user'))   ?? getPicturePath()}
          alt="userimage"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
        />
      </div>
      <div className="rightSection  w-full  pt-2 pr-4">
        <div className="twoSection  flex">
          <div className="leftSection w-full">
            <h3 className="font-semibold text-sm">{data.name}</h3>
            <p className="text-sm mt-2">{data.username}</p>
          </div>
          <div className="rightSection w-20">
            <p className="text-xs">{data.status == 'offline' ?  'In Active' : 'Active'}</p>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default UserFriendDisplayRow;
