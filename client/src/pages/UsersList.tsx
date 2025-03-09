import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUserModal } from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { formatDate, getImagePathUrl} from "@/utils/commonUtils";
import { useUserContext } from "@/contexts/userContext";
import CardComponent from "@/components/myComponents/CardComponent";
import SearchComponentGroupsUsers from "@/components/myComponents/SearchComponentGroupsUsers";
import { Dot } from "lucide-react";

export default function UsersList() {
  const [usersList,setUsersList] = useState<IUserModal[] |  null>(null);
  const {userData} = useUserContext();
  useEffect(() =>{
    if(usersList ===  null)
    {
        setUsersList(userData?.friendsList as IUserModal[]);
    } 
  },[userData,usersList]);

  return (
    <div className="p-4 space-y-4">
      <div className="header flex items-center justify-between   flex-wrap">
      <h1 className="capitalize text-2xl">Users</h1>
      <SearchComponentGroupsUsers currentPage={'users'} />
      </div>
      {/* Groups Header */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {Array.isArray(usersList) && usersList.map((data) => (
          <Link key={formatDate(data.createdAt)} to={`/user/${encodeURIComponent(data.name)}/chats`} state={data}>
            <div  className="px-4 py-2  rounded-lg text-sm cursor-pointer flex  items-center  justify-center flex-col">
              <div className="image relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={getImagePathUrl("user",data.picture)}
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
                      (data.status === 'online') ? "text-green-500" : "text-gray-600"
                    }`}
                  />
                </div>
              <p className="font-semibold  text-xs">{data.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Separator */}
      <Separator />

      {/* Search Bar */}
      <div className="flex justify-between flex-wrap-reverse gap-3">
        <Link to={'/friend/requests'} className="text-sm text-blue-500 hover:text-blue-600 hover:underline">Friend Requests</Link>
        <Input placeholder="Search..." className="md:w-1/3 md:min-w-[200px] w-full" />
      </div>

      {/* Chat List */}
      <div className="space-y-4 h-full  overflow-y-auto">
        {Array.isArray(usersList) && usersList.map((data) => (
          <Link key={Math.random()}  to={`/user/${encodeURIComponent(data.name)}/chats`} state={data}>
            <div  className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-900">
              {/* Avatar */}
              <div className="image relative">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={getImagePathUrl(
                      "username" in data ? "user" : "group",
                      data.picture
                    )}
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
                    (data.status === 'online') ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              {/* Chat Details */}
              <div className="flex-1">
                <p className="font-medium">{data.username}</p>
                <p className="text-sm text-gray-500 truncate">{data.name}</p>
              </div>
            </div>
          </Link>
        ))}
        {(!usersList  ||  (Array.isArray(usersList) &&  usersList.length == 0)) && <CardComponent />}
      </div>
      <ToastContainer />
    </div>
  );
}
