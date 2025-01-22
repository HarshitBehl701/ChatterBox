import React, { useEffect, useState } from "react";
import BaseLayout from "../layouts/BaseLayout";
import UserFriendDisplayRow from "../components/UserFriendDisplayRow";
import FriendsDisplayRow from "../components/FriendsDisplayRow";
import SearchFriendsList from "../components/SearchFriendsList";
import { handleError } from "../helpers/toastHelpers";
import { getUsersFriends } from "../helpers/userHelpers";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const [tempFriendListDataStore, setTempFriendListDataStore] = useState([]);
  const [friendsListData, setFriendsListData] = useState([]);

  useEffect(() => {
    const main = async () => {
      const response = await getUsersFriends();
      if (response.status) {
        setFriendsListData(response.data);
        setTempFriendListDataStore(response.data);
      } else {
        handleError(response.message);
      }
    };
    main();
  }, [location]);

  return (
    <>
      <BaseLayout>
        <FriendsDisplayRow friendsListData={tempFriendListDataStore} />
        <div className="header  flex items-center justify-between  flex-wrap">
          <h2 className="font-semibold text-2xl">Chats</h2>
          <SearchFriendsList
            originalList={tempFriendListDataStore}
            filterFriendList={setFriendsListData}
          />
        </div>
        <div className="userChatCont  h-[60vh] py-6 overflow-y-auto scrollbar-hidden scrollbar-hidden">
          {friendsListData.map((val, index) => (
            <UserFriendDisplayRow key={index} data={val} />
          ))}
          {friendsListData.length == 0 && (
            <p className="italic font-light">No Chats...</p>
          )}
        </div>
      </BaseLayout>
    </>
  );
}

export default Home;
