import React, { useEffect, useState } from "react";
import BaseLayout from "../layouts/BaseLayout";
import { useParams, Link, useNavigate } from "react-router-dom";
import MemberListDisplay from "../components/MemberListDisplay";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import GroupJoinRequestsMembersList from "../components/GroupJoinRequestsMembersList";
import GroupProfilePicture from "../components/GroupProfilePicture";
import AddNewMemberPopup from "../components/AddNewMemberPopup";
import {
  getGroupMembersList,
  manageGroupByAdmin,
  updateGroupName,
} from "../helpers/groupHelpers";
import { ToastContainer } from "react-toastify";

function GroupDetail() {
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupData, setGroupData] = useState({});
  const [isCurrentUserIsAdmin, setIsCurrentUserIsAdmin] = useState(false);
  const [isAddNewMemberPopupOpen, setIsAddNewMemberPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if the form is in edit mode
  const { groupname } = useParams();
  const [groupNameInputValue, setGroupNameInputValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const main = async () => {
      const groupMembersResponse = await getGroupMembersList(groupname);

      if (groupMembersResponse.status) {
        const data = groupMembersResponse.data;
        setGroupMembers(data.membersList);
        setGroupData(data.groupDetail);
        setGroupNameInputValue(data.groupDetail.name);
        setIsCurrentUserIsAdmin(data.is_current_user_is_Admin);
      } else {
        navigate('/groups')
        handleError(groupMembersResponse.message);
      }
    };
    main();
  }, [groupname]);

  const handleGroupNameChange = async () => {
    const response = await updateGroupName(groupData.name, groupNameInputValue);
    if (response.status) {
      handleSuccess("Successfully  Change Group  Name");
      setTimeout(() => {
        navigate(`/group_detail/${groupNameInputValue}`);
      }, 1000);
    } else {
      handleError(response.message);
    }
  };

  const handleManageGroup = async (action) => {
    if (
      window.confirm(
        `Are you  sure you want to ${
          action == "delete"
            ? "Delete this group (This Action Cannot undo)"
            : "change group   status   to"
        }  ${action}`
      )
    ) {
      const response = await manageGroupByAdmin(groupData.name, action);
      if (response.status) {
        handleSuccess(
          action == "delete"
            ? "Successfully Deleted  This Group"
            : "Successfully change  group  status"
        );
        if (action == "delete") {
          setTimeout(() => {
            navigate("/groups");
          }, 1000);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        handleError(response.message);
      }
    }
  };

  return (
    <BaseLayout>
      <Link
        to={`/group_chat/${groupname}`}
        className="text-gray-400 font-semibold text-xl rounded-full w-fit text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          fill="#6B7280"
          viewBox="0 0 320 512"
        >
          <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </Link>
      <div className="twoSectionLayout mt-4 flex pb-4 border-b border-gray-600 flex-wrap gap-6 items-center">
        <div className="leftSection">
          <GroupProfilePicture
            isCurrentUserIsAdmin={isCurrentUserIsAdmin}
            picture={groupData.picture}
            groupName={groupData.name}
          />
        </div>
        <div className="rightSection">
          <div className="flex ">
            <h1 className="font-semibold text-2xl">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={groupNameInputValue}
                  onChange={(e) => {
                    setGroupNameInputValue(e.target.value);
                  }}
                  className="text-xl font-semibold bg-gray-800   px-2 my-1 rounded-md"
                />
              ) : (
                groupData.name
              )}
            </h1>
            {isCurrentUserIsAdmin && isEditing == false && (
              <button
                className="text-xs ml-2 rounded-md text-blue-600 hover:text-blue-700 font-semibold h-fit mt-2"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="blue"
                  width="14"
                >
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                </svg>
              </button>
            )}
          </div>
          <p>{groupData.status}</p>
          <p>Admin Username: {groupData.adminUsername}</p>
          <p>Total Members: {groupData.totalMembers}</p>
          {isCurrentUserIsAdmin && (
            <>
              {isEditing == false && (
                <>
                  <button
                    className="block px-2  py-1 rounded-md text-xs  border  my-2 border-gray-200"
                    onClick={() => {
                      handleManageGroup(
                        groupData.status == "active" ? "inactive" : "active"
                      );
                    }}
                  >
                    {groupData.status == "active" ? "Inactive" : "Active"} This
                    Group
                  </button>
                  <button
                    className="block px-2  py-1 rounded-md text-xs  my-2 bg-red-700  hover:bg-red-800 font-semibold"
                    onClick={() => {
                      handleManageGroup("delete");
                    }}
                  >
                    Delete Group Permanently
                  </button>
                  <button
                    className="block px-2  py-1 rounded-md text-xs  my-2 bg-green-700  hover:bg-green-800 font-semibold"
                    onClick={() => {
                      setIsAddNewMemberPopupOpen(true);
                    }}
                  >
                    Add New Member
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    className="text-xs px-2 py-1  mr-3 rounded-md bg-green-700 hover:bg-green-800 font-semibold h-fit mt-2"
                    onClick={handleGroupNameChange}
                  >
                    Save Changes
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-800 font-semibold h-fit mt-2"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
        </div>
        {isAddNewMemberPopupOpen && (
          <AddNewMemberPopup
            setIsAddNewMemberPopupOpen={setIsAddNewMemberPopupOpen}
            groupName={groupData.name}
          />
        )}
      </div>
      <div className="memberLists">
        <h2 className="font-semibold mt-2 text-xl">Members</h2>
        <div className="memberListsContainer h-[250px] overflow-y-auto px-2 scrollbar-hidden">
          {isCurrentUserIsAdmin && (
            <GroupJoinRequestsMembersList groupName={groupname} />
          )}
          {groupMembers.map((val, index) => {
            if (val.username !== localStorage.getItem("user_name")) {
              return (
                <MemberListDisplay
                  key={index}
                  data={val}
                  groupname={groupname}
                  isCurrentUserIsAdmin={isCurrentUserIsAdmin}
                />
              );
            }
          })}
        </div>
      </div>
      <ToastContainer />
    </BaseLayout>
  );
}

export default GroupDetail;
