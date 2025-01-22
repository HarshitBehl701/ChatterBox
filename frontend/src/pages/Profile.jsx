import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import FriendListDisplay from "../components/FriendListDisplay";
import ProfilePicture from "../components/ProfilePicture";
import { username } from "../helpers/commonHelper";
import {
  getMyProfileDetail,
  getProfileDetail,
  updateUserProfileData,
} from "../helpers/userHelpers";

function Profile() {
  const { profileVisitUsername } = useParams();
  const currentLogin_username = username;
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const main = async () => {
      const response = profileVisitUsername
        ? await getProfileDetail(profileVisitUsername)
        : await getMyProfileDetail();
      if (response.status) {
        const data = response.data;
        setUserData(data);
        setFormData({
          name: data?.name || "",
          username: data?.username || "",
        });
      } else {
        handleError(response.message);
      }
    };

    main();
  }, [profileVisitUsername]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        name: userData?.name || "",
        username: userData?.username || "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateUserProfileData(formData);

    if (response.status) {
      handleSuccess("Profile updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      handleError(response.message);
    }
  };

  return (
    <BaseLayout>
      <h1 className="mb-4 font-semibold text-2xl">User Profile</h1>
      <div className="flex flex-wrap  md:flex-nowrap gap-5">
        <ProfilePicture
          currentLogin_username={currentLogin_username}
          username={profileVisitUsername}
          picture={userData?.picture}
        />
        <div className="rightSection shrink pt-4 md:pl-4">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-800 rounded-md  bg-gray-900"
              />
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-800 rounded-md bg-gray-900"
              />
              <input
                type="email"
                name="email"
                value={userData.email || ""}
                readOnly
                className="w-full p-2 border border-gray-800 rounded-md bg-gray-800"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-2 py-1 h-fit text-sm font-semibold bg-gray-600 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 h-fit text-sm   font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-xl mb-1">{userData?.name}</h2>
              <h3 className="mb-1">{userData?.username}</h3>
              {username?.contact && (
                <h3 className="mb-1">{userData?.contact}</h3>
              )}
              <p className="mb-1">{userData?.email}</p>
              {currentLogin_username == profileVisitUsername && (
                <button
                  onClick={handleEditToggle}
                  className="px-2 py-1 h-fit   font-semibold text-sm mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Edit Profile
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <br />
      {userData?.friendRequestReceived && (
        <div>
          <hr className="border border-gray-800" />
          <FriendListDisplay
            friendRequests={userData.friendRequestReceived}
            friendsList={userData.friendsList}
          />
        </div>
      )}
    </BaseLayout>
  );
}

export default Profile;
