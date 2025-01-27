import React, { useCallback, useState } from "react";
import { getAllUsersList } from "../helpers/userHelpers";
import { getPicturePath } from "../helpers/commonHelper";
import { useLocation, useNavigate } from "react-router-dom";

function SearchUser({ midScreen }) {
  const location  = useLocation();
  const  navigate  =  useNavigate();
  const [searchText, setSearchText] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [isDropdownOpen,setIsDropDownOpen] =  useState(false);

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsDropDownOpen(true);
  };

  const handleInputClickEvent = async () => {
    const response = await getAllUsersList();
    if (response.status && response.data.length > 0) {
      setUsersData(response.data);
    }
  };

  const handleUserProfileVisitBtn = useCallback((username)  =>  {
    setIsDropDownOpen(false);
    setSearchText('')
    navigate(`/profile/${encodeURIComponent(username)}`);
  },[location])

  return (
    <div
      className={
        midScreen === "block"
          ? "relative hidden md:block w-80"
          : "relative md:hidden block w-full mt-2"
      }
    >
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search icon</span>
      </div>
      <input
        type="text"
        id="search-navbar"
        className={
          midScreen === "block"
            ? "block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            : "block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        }
        placeholder="Search User..."
        value={searchText}
        onChange={handleInputChange} // Track input changes
        onClick={handleInputClickEvent}
        autoComplete="off"
      />
      {/* Conditionally render the "search results" div */}
      {isDropdownOpen && (
        <div className="mt-2 p-4 border absolute md:w-80 w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white">
          <p className="text-sm">
            Showing results for: <strong>{searchText}</strong>
          </p>
          <ul className="mt-2 space-y-1  max-h-[200px]  overflow-y-auto scrollbar-hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li   key={index} className="p-2 border-b  border-gray-500  mb-2 hover:bg-gray-600 hover:rounded-md" onClick={() =>  {handleUserProfileVisitBtn(user.username)}}>
                    <div className="twoSectionLayout  flex  items-center gap-3">
                      <div className="leftSection">
                        <img
                          src={
                            (user?.picture &&
                              getPicturePath(user?.picture,'user')) ??
                            getPicturePath()
                          }
                          alt="userProfile"
                          className="w-8  h-8  rounded-full"
                        />
                      </div>
                      <div className="rightSection">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-sm font-semibold">
                          {user?.username}
                        </p>
                      </div>
                    </div>
                  </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-400">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchUser;
