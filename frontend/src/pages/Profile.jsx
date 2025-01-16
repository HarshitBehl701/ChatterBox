import React from 'react'
import BaseLayout from "../layouts/BaseLayout";
import  {Link}   from  "react-router-dom";

function Profile() {
  return (
    <>
    <BaseLayout>
        <h1 className='mb-4  font-semibold text-2xl'>User Profile</h1>
        <div className="twoSectionLayout flex gap-5 flex-wrap">
            <div className="leftSection">
                <img src="/assets/images/user.jpg" alt="user"  className='w-44  h-44 border-4  border-gray-700  rounded-full' />
            </div>
            <div className="rightSection  pt-4 md:pl-4">
                <h2 className='text-xl  mb-1'>Full Name</h2>
                <h3 className='mb-1'>@Username</h3>
                <p  className='mb-1'>+01-1234567890</p>
                <p  className='mb-1'>email@gmail.com</p>
                <Link to={'/edit-profile'} className='px-2  py-1 text-sm   rounded-lg  mt-1 inline-block  bg-blue-600  hover:bg-blue-700 text-white  font-semibold'>Edit  Profile</Link>
            </div>
        </div>
    </BaseLayout>
    </>
  )
}

export default Profile