import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { IGroupRequestsModal } from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { getImagePathUrl, handleCatchErrors} from "@/utils/commonUtils";
import { useUserContext } from "@/contexts/userContext";
import CardComponent from "@/components/myComponents/CardComponent";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGroupAllJoinRequests } from "@/api/groupApi";
import { IGetAllGroupsRequestsResponse } from "@/interfaces/apiInterfaces";
import { useUtilsContext } from "@/contexts/utilsContext";

export default function GroupRequests() {
  const {userData,userAllGroupsRequests} = useUserContext();
  const {manageGroupRequestForAdmin,manageGroupRequestForUser} = useUtilsContext();
  const [groupRequests,setGroupRequests] = useState<IGroupRequestsModal[] | null>(null);
  const [groupRequestsForAdmin,setGroupRequestsForAdmin]  =  useState<IGroupRequestsModal[] | null>(null);
  useEffect(() =>{
    if(groupRequests ===  null)
        setGroupRequests(userAllGroupsRequests);
  },[userData,groupRequests,userAllGroupsRequests]);

  useEffect(() =>{
    if(groupRequestsForAdmin ==  null)
    {
      ;(async()  =>{
        try {
          const   response  = await getGroupAllJoinRequests();
          if(response.status)
          {
            const responseData  = (response.data  as IGetAllGroupsRequestsResponse)
            setGroupRequestsForAdmin(responseData.groupJoinRequests);
          }else
          {
            setGroupRequestsForAdmin([])
            throw   new Error(response.message);
          }
        } catch (error) {
          setGroupRequestsForAdmin([])
          throw new Error(handleCatchErrors(error));
        }
      })()
    }
  },[userData,groupRequestsForAdmin]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="capitalize text-2xl mb-3">Group Requests</h1>
      {/* Separator */}
      <Separator />

      {/* Search Bar */}
      <div className="flex justify-end">
        <Input placeholder="Search..." className="w-1/3 min-w-[200px]" />
      </div>

      {/* Chat List */}
      <div className="space-y-4 h-full  overflow-y-auto">
        {Array.isArray(groupRequests) &&  Array.isArray(groupRequestsForAdmin) && [...groupRequests,...groupRequestsForAdmin].map((data) => (
          <div key={Math.random()} className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-900">
          {/* Avatar */}
          <div className="image relative">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={getImagePathUrl(
                  data.request_by == 'group' && data.groupId.adminUserId._id  ===  userData?._id ? "user" :  'group' ,
                  data.request_by == 'group' && data.groupId.adminUserId._id  ===  userData?._id ? data.userId.picture :  data.groupId.picture
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
                    data.groupId.status ===  'active' ?  "text-green-500" : "text-gray-600"
                ) 
              }`}
            />
          </div>
          {/* Chat Details */}
          <div className="flex  flex-wrap items-center justify-between  w-full gap-2">
          <div className="flex-1">
            <p className="text-sm text-gray-500 truncate">{
              data.request_by == 'group' && data.groupId.adminUserId._id  ===  userData?._id ? data.userId.name :  data.groupId.name
              }</p>
              {data.request_by == 'group' && data.groupId.adminUserId._id  ===  userData?._id && <p className="text-sm text-gray-500 truncate">@{data.userId.name}</p>}
          </div>
          <div>
            {
                (data.request_by ===  'user' && data.groupId.adminUserId._id == userData?._id) ?   
                <>
                <div className="flex gap-2">
                <Button  className="text-xs p-2 h-fit  font-semibold bg-green-600   hover:bg-green-700   cursor-pointer"  onClick={() => manageGroupRequestForAdmin(data,'accepted')}>Accept Request</Button>
                <Button  className="text-xs  p-2 h-fit font-semibold bg-red-500   hover:bg-red-600   cursor-pointer"   onClick={() => manageGroupRequestForAdmin(data,'rejected')}>Reject Request</Button>
                </div>
                </>
                : 
                (
                  data.request_by ===  'group' && data.userId._id == userData?._id  ?
                  <>
                  <div className="flex gap-2 flex-wrap">
                  <Button className="text-xs p-2 h-fit  font-semibold bg-green-600   hover:bg-green-700   cursor-pointer" onClick={() => manageGroupRequestForUser(data,'accepted')}>Accept Request</Button>
                  <Button  className="text-xs  p-2 h-fit font-semibold bg-red-500   hover:bg-red-600   cursor-pointer"  onClick={() => manageGroupRequestForUser(data,'rejected')}>Reject Request</Button>
                  </div>
                  </>
                  :
                  (
                    data.request_by ===  'user' && data.userId._id == userData?._id  ?
                    <Button className="text-xs p-2 h-fit  font-semibold bg-red-500  hover:bg-red-600   cursor-pointer"   onClick={() => manageGroupRequestForUser(data,'rejected')}>Cancel Join Request</Button>
                    :
                    (
                      data.request_by ===  'group' && data.groupId.adminUserId._id == userData?._id  ?
                      <Button className="text-xs p-2 h-fit  font-semibold bg-red-500  hover:bg-red-600  cursor-pointer"    onClick={() => manageGroupRequestForAdmin(data,'rejected')}>Cancel Join Request</Button>
                      :
                      null
                    )
                  )
                )

            }
          </div>
          </div>
        </div>
        ))}
        {(!groupRequests  ||  (Array.isArray(groupRequests) &&  groupRequests.length == 0)) && <CardComponent />}
      </div>
      <ToastContainer />
    </div>
  );
}
