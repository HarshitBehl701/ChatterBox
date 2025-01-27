import React from "react";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import { addNewFriend } from "../helpers/userHelpers";
import { manageGroupMembersByAdmin } from "../helpers/groupHelpers";
import { getPicturePath } from "../helpers/commonHelper";

function MemberListDisplay({ groupname, data, isCurrentUserIsAdmin }) {
  const currentListUserName = data.username;
  const currentLoginUserName = localStorage.getItem("user_name");

  const handleAddFriend = async () => {
    if (currentListUserName !== currentLoginUserName) {
      const response = await addNewFriend(currentListUserName);
      if (response.status) {
        handleSuccess("Friend Request  Sent");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        handleError(response.message);
      }
    } else {
      handleError("Some Unexpected Error Occured");
    }
  };

  const manageGroupMember = async (action) => {
    if (
      window.confirm(
        `Are  you  sure you want to ${
          action == "transfer_ownership" ? "transfer  ownership  to" : "kick"
        }  ${data.username}  ${
          action != "transfer_ownership" ? "from the group" : ""
        } (This  action  cannot  be undo  after confirming)`
      )
    ) {
      const response = await manageGroupMembersByAdmin(
        groupname,
        data.username,
        action
      );
      if (response.status) {
        handleSuccess("successfully completed  the  action");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        handleError(response.message);
      }
    }
  };

  return (
    <div className="twoSectionLayout  my-3 flex items-center gap-5  pb-3  border-b border-gray-700">
      <div className="leftSection  w-20 h-20  rounded-full overflow-hidden shrink-0">
        <img
          src={
            (data.picture && getPicturePath(data.picture,'user')) ||
            getPicturePath()
          }
          alt="user"
          className="w-full  h-full  object-cover"
        />
      </div>
      <div className="rightSection w-full">
        <div className="twoSectionLayout flex items-center justify-between flex-wrap">
          <div className="leftSection">
            <p className="font-semibold">{data.name}</p>
            <p className="font-semibold text-sm">{data.username}</p>
            <p className="font-semibold text-sm">{data.status}</p>
          </div>
          <div className="rightSection w-1/3 flex items-center  justify-end  gap-3">
            {data.is_friend == false && (
              <button
                className="font-semibold  bg-green-700 hover:bg-green-800 cursor-pointer text-xs rounded-md px-2 py-1"
                onClick={handleAddFriend}
              >
                Add Friend
              </button>
            )}
            {isCurrentUserIsAdmin && (
              <>
                <button
                  className="text-red-600 hover:text-red-700  px-2 py-1 rounded-md font-semibold text-xs"
                  onClick={() => {
                    manageGroupMember("transfer_ownership");
                  }}
                >
                  Transfer Ownership
                </button>
                <button
                  className="bg-gray-800 hover:bg-gray-900 px-2 py-1 rounded-md text-xs font-semibold"
                  onClick={() => {
                    manageGroupMember("remove_member");
                  }}
                >
                  Remove Member
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberListDisplay;
