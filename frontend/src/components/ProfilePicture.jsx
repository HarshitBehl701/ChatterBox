import React, { useState } from "react";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import { ToastContainer } from "react-toastify";
import { updateProfilePicture } from "../api/user";

function ProfilePicture({ currentUserName, username ,picture}) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      handleError("Please select a file.")
      return;
    }

    try {
      const response = await updateProfilePicture(localStorage.getItem('token'),localStorage.getItem('user_name'),selectedFile);

      if (response.status) {
        handleSuccess("Profile picture updated successfully!");
        setTimeout(()=>{window.location.reload()},1000)
      } else {
        handleError("Failed to upload profile picture.")
      }
    } catch (error) {
      handleError(error.message)
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group w-44 h-44 shrink-0 border-4 overflow-hidden border-gray-700 rounded-full">
        <img
          src={preview  || (picture  &&  `/src/assets/images/profilePicture/${picture}`) || "/src/assets/images/user.jpg"}
          alt="user"
          className="w-full h-full object-cover"
        />
        {currentUserName === username || (!username &&  currentUserName) && (
          <>
            <input
              type="file"
              className="hidden"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              id="profilePicture"
            />
            <label
              htmlFor="profilePicture"
              className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              Change Picture
            </label>
          </>
        )}
      </div>
      {selectedFile && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-2 py-1 h-fit font-semibold text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Picture
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

export default ProfilePicture;