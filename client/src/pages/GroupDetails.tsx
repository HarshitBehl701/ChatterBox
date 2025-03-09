import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CardComponent from "@/components/myComponents/CardComponent";
import {getImagePathUrl, handleCatchErrors, handleToastPopup} from "@/utils/commonUtils";
import { Dot } from "lucide-react";
import { IGroupModal,IGroupRequestsModal} from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { useUtilsContext } from "@/contexts/utilsContext";
import { useUserContext } from "@/contexts/userContext";
import EditGroup from "@/components/myComponents/EditGroup";
import GroupMembers from "@/components/myComponents/GroupMembers";
import { leaveGroupForUser } from "@/api/groupApi";

function GroupDetails() {
  const location = useLocation();
  const [pageData] = useState<IGroupModal>(location.state || {});
  const {isUserAGroupMember,isUserGroupJoinRequestPending,sendGroupJoinRequest} =  useUtilsContext();
  const [isUserAlreadyAGroupMember,setIsUserAlreadyAGroupMember] = useState<boolean |  null>(null);
  const [isGroupJoinRequestPending,setIsGroupJoinRequestPending] = useState<IGroupRequestsModal   |null>(null);
  const {userData} = useUserContext();
  const navigate  = useNavigate();

  useEffect(()=>{
    if(isUserAlreadyAGroupMember  ==  null)
    {
      let  isUserGroupMember = false;
      if(Array.isArray(pageData.members))
      {
        pageData.members.forEach(data => {
          if(data._id.includes(userData?._id  as string))
            isUserGroupMember = true;
        });
      }
      setIsUserAlreadyAGroupMember(isUserGroupMember);
    }
    else if(isGroupJoinRequestPending == null)
        (async () => {setIsGroupJoinRequestPending(await  (isUserGroupJoinRequestPending(pageData._id)))})();
  },[isGroupJoinRequestPending,userData,isUserAGroupMember,isUserAlreadyAGroupMember,isUserGroupJoinRequestPending,pageData]);

  const leaveGroup = useCallback(async () => {
    if(pageData)
    {
      try {
        const  response   = await leaveGroupForUser(pageData._id);
        if(response.status)
        {
          handleToastPopup({message:"successfully leave group",type:'success'});
          setTimeout(()=>navigate('/groups'),500);
          setTimeout(()=>window.location.reload(),800);
        }else
          handleToastPopup({message:(response.message),type:"error"});
      } catch (error) {
        handleToastPopup({message:handleCatchErrors(error),type:"error"});
      }
    }
  },[pageData,navigate]);

  if (!pageData || Object.keys(pageData).length === 0) {
    return <CardComponent />;
  }

  return (
    <>
      <div className="flex items-center justify-center h-full w-full p-6 ">
        <div className="relative w-full max-w-lg ">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-border" />

          <Card className="relative w-full shadow-2xl rounded-xl border bg-transparent p-1 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center bg-gray-800 h-fit py-4 rounded-xl text-white text-lg font-semibold space-y-4">
              <div className="image relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={getImagePathUrl(
                      "group",
                      pageData.picture
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
                  className={`scale-300 bottom-0 right-4 absolute ${
                    (pageData.status  === 'active') ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              <CardTitle className="text-xl mt-2 flex flex-col items-center  gap-2">
                <p className="text-center">{pageData.name}</p>
                {isUserAlreadyAGroupMember && <>
                  <Badge>Member</Badge>
                  <Button  onClick={leaveGroup} size={'sm'} className="bg-red-500 text-xs hover:bg-red-600 cursor-pointer">Leave  Group</Button>
                </>}
                {pageData.adminUserId && pageData.adminUserId._id.includes(userData?._id as  string) && (
                  <Badge   className="bg-purple-500">Admin</Badge>
                )}
              </CardTitle>
              {isUserAlreadyAGroupMember ||  (pageData.adminUserId && pageData.adminUserId._id.includes(userData?._id as  string)) &&  <GroupMembers trigger={<Button  className="bg-blue-600  hover:bg-blue-700 cursor-pointer  text-xs p-2 h-fit">Members</Button>} groupData={pageData} />}
              {!isUserAlreadyAGroupMember && !(pageData.adminUserId && pageData.adminUserId._id.includes(userData?._id as  string)) && (
                <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs font-semibold" onClick={()=>sendGroupJoinRequest(pageData._id)}>
                  Send Join Request
                </Button>
              )}
              {pageData.adminUserId && pageData.adminUserId._id.includes(userData?._id as string)  && <EditGroup trigger={<Button className="bg-blue-600 hover:bg-blue-700  cursor-pointer text-xs">Edit Group</Button>} groupData={pageData} />}
              <Button
                className="cursor-pointer"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default GroupDetails;
