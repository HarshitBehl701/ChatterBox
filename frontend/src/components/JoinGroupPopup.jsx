import React, { useEffect, useState } from "react";
import GroupsList from "./GroupsList";
import { getGroupsListForJoining } from "../helpers/groupHelpers";

function JoinGroupPopup({ setIsGroupJoinPopupOpen }) {
  const [groupsList, setGroupsList] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);

  useEffect(() => {
    const main = async () => {
      const groupsListResponse = await getGroupsListForJoining();
      if (groupsListResponse.status) {
        setGroupsList(groupsListResponse.data);
        setFilterGroups(groupsListResponse.data);
      }
    };

    main();
  }, []);

  const handleInputChangeEvent = (e) => {
    const newFilteredData = groupsList.filter((val) => {
      if (
        val.name.toLowerCase().includes(e.target.value.trim().toLowerCase()) ||
        e.target.value == ""
      )
        return true;
      return false;
    });

    setFilterGroups(newFilteredData);
  };

  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      className="backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen"
    >
      <div className="relative  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Join Group
            </h3>
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
              onClick={() => {
                setIsGroupJoinPopupOpen(false);
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form
              className="space-y-4"
              onSubmit={(ev) => {
                ev.preventDefault();
              }}
            >
              <div>
                <label
                  htmlFor="groupName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Search Group Name
                </label>
                <input
                  type="text"
                  name="groupName"
                  id="groupName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter Group  Name"
                  required
                  onChange={(e) => {
                    handleInputChangeEvent(e);
                  }}
                />
              </div>
              <div className="friendList border p-2  rounded-md border-gray-600 bg-gray-600 flex flex-col">
                <h1 className="text-xs font-semibold  mb-4">Groups</h1>
                <ul className="h-48 overflow-y-auto scrollbar-hidden">
                  {filterGroups.map((val, index) => (
                    <GroupsList data={val} key={index} />
                  ))}
                  {filterGroups.length == 0 && (
                    <p className="font-light italic text-sm">
                      No Group Found...
                    </p>
                  )}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGroupPopup;
