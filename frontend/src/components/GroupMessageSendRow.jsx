import React from 'react'
import  {getPicturePath} from  "../helpers/commonHelper";

function GroupMessageSendRow({message,username,picture}) {
  return (
    <div className="flex gap-4 items-center  justify-end my-2">
    <div>
    <p  className='text-right   font-semibold text-sm text-gray-500'>{username}</p>
      <div className="relative bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs shadow-md">
        <p className="break-words">
          {message}
        </p>
        <div className="absolute top-3 right-[-8px] w-4 h-4 bg-gray-100 rotate-45"></div>
      </div>
    </div>
      <img
        src={(picture  &&  getPicturePath(picture,'user')) || getPicturePath()}
        alt="user"
        className="w-12 h-12 rounded-full object-cover self-end"
      />
    </div>
  )
}

export default GroupMessageSendRow