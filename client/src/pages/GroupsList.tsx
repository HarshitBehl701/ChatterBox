import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import CreateGroup from "@/components/myComponents/CreateGroup";
import { useEffect, useState } from "react";
import { IGroupModal } from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { getImagePathUrl, handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { getUserAllGroups } from "@/api/userApi";
import { IGetUserAllGroupsResponse } from "@/interfaces/apiInterfaces";
import { useUserContext } from "@/contexts/userContext";
import CardComponent from "@/components/myComponents/CardComponent";
import SearchComponentGroupsUsers from "@/components/myComponents/SearchComponentGroupsUsers";
import { Dot } from "lucide-react";

export default function GroupsList() {
  const [groups,setGroups] = useState<IGroupModal[] |  null>(null);
  const {userData} = useUserContext();
  useEffect(() =>{
    if(groups  ===  null)
    {
        ;(async()=> {
            try {
                const response  =  await getUserAllGroups();
                if(response.status)
                {
                  const responseData  = (response.data as IGetUserAllGroupsResponse).groups;
                  setGroups(responseData);
                }else
                  throw new Error(response.message);
            } catch (error) {
                handleToastPopup({message:handleCatchErrors(error),type:"error"});
            }
        })()
    }
  },[userData,groups]);
  return (
    <div className="p-4 space-y-4">
      <div className="header flex items-center justify-between flex-wrap">
      <h1 className="capitalize text-2xl">Groups</h1>
      <SearchComponentGroupsUsers currentPage={'groups'} />
      </div>
      {/* Groups Header */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {Array.isArray(groups) && groups.map((group) => (
          <Link key={Math.random()}  to={`/group/${encodeURIComponent(group.name)}/chats`} state={group}>
          <div className="px-4 py-2  rounded-lg text-sm cursor-pointer flex  items-center  justify-center flex-col">
            <div className="image relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={getImagePathUrl("group",group.picture)}
                    className="cursor-pointer"
                  />
                  <AvatarFallback>
                    <img
                      src="https://github.com/shadcn.png"
                      className="cursor-pointer"
                    />
                  </AvatarFallback>
                </Avatar>
                <Dot
                  className={`scale-300 bottom-0 right-1 absolute ${
                    (group.status === 'active') ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
            <p className="font-semibold  text-xs">{group.name}</p>
          </div>
          </Link>
        ))}
      </div>

      {/* Separator */}
      <Separator />

      {/* Search Bar */}
      <div className="flex justify-between flex-wrap-reverse  gap-3">
        <div className="buttons flex gap-3  items-center">
          <CreateGroup  />
          <Link to={'/group/requests'} className="text-sm text-blue-500 hover:text-blue-600 hover:underline">Group Requests</Link>
        </div>
        <Input placeholder="Search..." className="md:w-1/3 md:min-w-[200px] w-full" />
      </div>

      {/* Chat List */}
      <div className="space-y-4 h-full  overflow-y-auto">
        {Array.isArray(groups) && groups.map((group) => (
          <Link key={Math.random()}  to={`/group/${encodeURIComponent(group.name)}/chats`} state={group}>
            <div  className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-900">
              {/* Avatar */}
              <div className="image relative">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={getImagePathUrl("group",group.picture)}
                    className="cursor-pointer"
                  />
                  <AvatarFallback>
                    <img
                      src="https://github.com/shadcn.png"
                      className="cursor-pointer"
                    />
                  </AvatarFallback>
                </Avatar>
                <Dot
                  className={`scale-300 -bottom-1 -right-1 absolute ${
                    group.status === 'active' ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              {/* Chat Details */}
              <div className="flex-1">
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500 truncate">{group.status}</p>
              </div>
            </div>
          </Link>
        ))}
        {(!groups  ||  (Array.isArray(groups) &&  groups.length == 0)) && <CardComponent />}
      </div>
      <ToastContainer />
    </div>
  );
}