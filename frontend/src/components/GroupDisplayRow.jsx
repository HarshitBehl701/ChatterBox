import React from 'react'
import GroupDisplay from './GroupDisplay'

function GroupDisplayRow({userGroups}) {
  return (
    <div className="userDisplaySection bg-black mb-5 border-b border-gray-600 p-3">
      <div className="userSliderContainer relative">
        <div className="flex gap-8 overflow-x-auto scrollbar-hidden">
            {userGroups.map((val,index)  => <GroupDisplay  key={index}  data={val} />)}
        </div>
      </div>
    </div>
  )
}

export default GroupDisplayRow