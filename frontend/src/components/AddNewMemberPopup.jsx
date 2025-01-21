import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { handleError } from '../helpers/toastHelpers';
import { getAllUserListForAddingNewMembersToGroup, getAllUsers } from '../api/user';
import AddNewMemberList from './AddNewMemberList';

function AddNewMemberPopup({setIsAddNewMemberPopupOpen,groupName}) {

    const  [usersData,setUsersData] = useState([]);

    useEffect(() =>{
        const  main = async () => {
            try{
                  const response   = await getAllUserListForAddingNewMembersToGroup(localStorage.getItem('token'),localStorage.getItem('user_name'),groupName);
                  if(response.status){
                    setUsersData(response.data);
                  }else{
                    handleError(response.message)
                  }
                }catch(error){
                  handleError(error.message)
                }
        }
        main();
    },[])


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
                Add New Member
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() =>{setIsAddNewMemberPopupOpen(false)}}
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
            <div className="addNewMembers border p-2  rounded-md border-gray-600 bg-gray-600 flex flex-col">
                  <h1 className="text-xs font-semibold  mb-4">Users List</h1>
                  <ul className="h-48 overflow-y-auto scrollbar-hidden">
                    {usersData.map((val,index) => {
                        return <AddNewMemberList key={index} picture={val.picture} name={val.name} username={val.username} groupName={groupName} />
                    })}
                  </ul>
                </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
  )
}

export default AddNewMemberPopup