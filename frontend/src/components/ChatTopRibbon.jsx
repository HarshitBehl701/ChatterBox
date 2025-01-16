import React from "react";

function ChatTopRibbon() {
  return (
    <div className="topNav flex items-center  gap-6   border-b border-gray-600 pb-3">
      <p className="text-gray-400  font-semibold text-xl rounded-full  w-fit text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          fill="#6B7280"
          viewBox="0 0 320 512"
        >
          <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </p>
      <div className="userDetail flex gap-4 items-center">
        <img
          src="/assets/images/user.jpg"
          alt="user"
          className="w-10   h-10 rounded-full"
        />
        <p className="font-semibold">Name</p>
      </div>
    </div>
  );
}

export default ChatTopRibbon;
