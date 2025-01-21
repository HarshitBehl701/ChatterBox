import React from 'react'

function MessageSendRow({message,profilePicture}) {
  return (
    <div className="flex gap-4 items-start  justify-end my-2">
      <div className="relative bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs shadow-md">
        <p className="break-words">
          {message}
        </p>
        <div className="absolute top-3 right-[-8px] w-4 h-4 bg-gray-100 rotate-45"></div>
      </div>
      <img
        src={(profilePicture &&  `/src/assets/images/profilePicture/${profilePicture}`) || "/src/assets/images/user.jpg"}
        alt="user"
        className="w-12 h-12 rounded-full"
      />
    </div>
  )
}

export default MessageSendRow