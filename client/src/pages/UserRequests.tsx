import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IFriendRequestModal } from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { getImagePathUrl} from "@/utils/commonUtils";
import { useUserContext } from "@/contexts/userContext";
import CardComponent from "@/components/myComponents/CardComponent";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUtilsContext } from "@/contexts/utilsContext";

export default function UserRequests() {
  const {userData,userAllFriendsRequests} = useUserContext();
  const [friendRequests,setFriendRequests] = useState<IFriendRequestModal[] | null>(null);
  const  {manageFriendRequest} = useUtilsContext();
  useEffect(() =>{
    if(friendRequests ===  null)
        setFriendRequests(userAllFriendsRequests);
  },[userData,friendRequests,userAllFriendsRequests]);


  return (
    <div className="p-4 space-y-4">
      <h1 className="capitalize text-2xl mb-3">Friend Requests</h1>
      {/* Separator */}
      <Separator />

      {/* Search Bar */}
      <div className="flex justify-end">
        <Input placeholder="Search..." className="w-1/3 min-w-[200px]" />
      </div>

      {/* Chat List */}
      <div className="space-y-4 h-full  overflow-y-auto">
        {Array.isArray(friendRequests) && friendRequests.map((data) => (
          <Link key={Math.random()}  to={`/user/${encodeURIComponent(
            data.request_sent_to_user_id._id ==  userData?._id  ?   
            data.request_sent_by_user_id.name 
            : 
            data.request_sent_to_user_id.name 
          )}/details`} state={data}>
            <div  className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-900">
              {/* Avatar */}
              <div className="image relative">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={getImagePathUrl(
                      "user",
                      data.request_sent_to_user_id._id ==  userData?._id  ?   
                      data.request_sent_by_user_id.picture 
                      : 
                      data.request_sent_to_user_id.picture 
                    )}
                    className="cursor-pointer object-cover"
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
                    (
                        data.request_sent_to_user_id._id ==  userData?._id  ?   
                        data.request_sent_by_user_id.status ===  'online' ?  "text-green-500" : "text-gray-600"
                        : 
                        data.request_sent_to_user_id.status ===  'online' ?  "text-green-500" : "text-gray-600"
                    ) 
                  }`}
                />
              </div>
              {/* Chat Details */}
              <div className="flex-1">
                <p className="font-medium">{
                    data.request_sent_to_user_id._id ==  userData?._id  ?   
                    data.request_sent_by_user_id.username 
                    : 
                    data.request_sent_to_user_id.username 
                    }</p>
                <p className="text-sm text-gray-500 truncate">{
                    data.request_sent_to_user_id._id ==  userData?._id  ?   
                    data.request_sent_by_user_id.name
                    : 
                    data.request_sent_to_user_id.name
                    }</p>
              </div>
              <div>
                {
                    data.request_sent_to_user_id._id ==  userData?._id  ?   
                    <>
                    <div className="flex gap-2">
                    <Button  className="text-xs p-2 h-fit  font-semibold bg-green-600   hover:bg-green-700   cursor-pointer"  onClick={() => manageFriendRequest(data,'accepted')}>Accept Request</Button>
                    <Button  className="text-xs  p-2 h-fit font-semibold bg-red-500   hover:bg-red-600   cursor-pointer"  onClick={() => manageFriendRequest(data,'rejected')}>Reject Request</Button>
                    </div>
                    </>
                    : 
                    <Button className="text-xs p-2 h-fit  font-semibold bg-gray-800  hover:bg-gray-800   cursor-pointer"  onClick={() => manageFriendRequest(data,'rejected')}>Requested..</Button>

                }
              </div>
            </div>
          </Link>
        ))}
        {(!friendRequests  ||  (Array.isArray(friendRequests) &&  friendRequests.length == 0)) && <CardComponent />}
      </div>
      <ToastContainer />
    </div>
  );
}
