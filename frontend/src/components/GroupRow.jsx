import React from "react";
import { Link } from "react-router-dom";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import { manageAllIncomingGroupRequestsComesFromGroupAdmin } from "../helpers/groupHelpers";

function GroupRow({ isRequestRow = false, data }) {
  const handleGroupRequest = async (action) => {
    const groupRequestResponse =
      await manageAllIncomingGroupRequestsComesFromGroupAdmin(
        data?.groupId,
        action
      );
    if (groupRequestResponse.status) {
      handleSuccess(`Successfully ${action} group  request`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      handleError(groupRequestResponse.message);
    }
  };
  return (
    <Link to={`/group_chat/${encodeURIComponent(data?.groupName)}`}>
      <div className="twoSectionLayout border-b mb-4 border-gray-700 pb-2  flex gap-5">
        <div className="leftSection w-24">
          <img
            src={
              (data?.groupPicture &&
                `/src/assets/images/groupPicture/${data?.groupPicture}`) ||
              "/src/assets/images/user.jpg"
            }
            alt="userimage"
            className="w-20 h-20 rounded-full border-2 border-gray-600"
          />
        </div>
        <div className="rightSection  w-full  pt-2 pr-4">
          <div className="twoSection  flex">
            <div className="leftSection w-full">
              <h3 className="font-semibold text-sm">{data?.groupName}</h3>
              <h3 className="font-semibold text-sm">
                Admin: {data?.adminUsername}
              </h3>
            </div>
            <div
              className={
                isRequestRow ? "rightSection w-1/3" : "rightSection w-20"
              }
            >
              {!isRequestRow && <p className="text-xs">Active</p>}
              {isRequestRow && (
                <div>
                  <button
                    className="bg-green-600   hover:bg-green-700  cursor-pointer  text-xs font-semibold mr-2 px-2   py-1  rounded-md"
                    onClick={() => {
                      handleGroupRequest("accept");
                    }}
                  >
                    Accept Invite
                  </button>
                  <button
                    className="bg-red-600   hover:bg-red-700  cursor-pointer  text-xs font-semibold mr-2 px-2   py-1  rounded-md"
                    onClick={() => {
                      handleGroupRequest("rejected");
                    }}
                  >
                    Reject Invite
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GroupRow;
