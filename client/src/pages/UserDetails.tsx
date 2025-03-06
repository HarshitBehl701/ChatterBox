import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CardComponent from "@/components/myComponents/CardComponent";
import {getImagePathUrl} from "@/utils/commonUtils";
import { Dot } from "lucide-react";
import { useUserContext } from "@/contexts/userContext";
import {IFriendRequestModal, IUserModal} from "@/interfaces/commonInterface";
import { ToastContainer } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { useUtilsContext } from "@/contexts/utilsContext";

function UserDetails() {
  const location = useLocation();
  const [pageData] = useState<IUserModal>(location.state || {});
  const { userData } = useUserContext(); //login  user  Data
  const { isFriendRequestPending,sendFriendRequest,manageFriendRequest,removeFriendfn} = useUtilsContext();
  const  [isUserFriend,setIsUserFriend] =   useState<boolean |  null>(null);
  const  [isUserFriendRequestPending,setIsUserFriendRequestPending] = useState<IFriendRequestModal |  null>(null);

  useEffect(() =>{
    if(isUserFriend ==  null){
      userData?.friendsList.forEach(friend => {
        if(friend._id.includes(pageData._id))
          setIsUserFriend(true);
      });
    }
    else if(isUserFriendRequestPending ==  null)
        (async () => {setIsUserFriendRequestPending(await isFriendRequestPending(pageData._id))})();
  },[isUserFriend,pageData,userData,isFriendRequestPending,isUserFriendRequestPending]);

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
                      "username" in pageData ? "user" : "group",
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
                    pageData.status ===  'online' ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              <CardTitle className="text-xl mt-2 flex flex-col items-center  gap-2">
                <p className="text-center">{pageData.name || "Unknown"}</p>
                {"friendsList" in pageData && (
                  <p className="text-sm text-white text-center">
                    @{(pageData as IUserModal).username}
                  </p>
                )}
                {isUserFriend && (
                  <Badge>friends</Badge>
                )}
              </CardTitle>
              {!isUserFriend &&   !isUserFriendRequestPending  && (
                  <Button
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs font-semibold"
                    onClick={() =>   sendFriendRequest(pageData._id)}
                  >
                    Send Friend Request
                  </Button>
                )}
              {!isUserFriend &&  isUserFriendRequestPending && (
                  <Button
                    className="cursor-pointer text-xs font-semibold"
                    onClick={() => manageFriendRequest(isUserFriendRequestPending,"rejected")}
                  >
                    Request Pending...
                  </Button>
                )}
              {!isUserFriend && isUserFriendRequestPending && isUserFriendRequestPending.request_sent_to_user_id._id == userData?._id && (
                  <div className="flex  gap-2  items-center">
                    <Button
                      className="cursor-pointer bg-green-700 hover:bg-green-800 text-xs font-semibold"
                      onClick={() => manageFriendRequest(isUserFriendRequestPending,"accepted")}
                    >
                      Accept Request
                    </Button>
                    <Button
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-xs font-semibold"
                      onClick={() => manageFriendRequest(isUserFriendRequestPending,"rejected")}
                    >
                      Reject Request
                    </Button>
                  </div>
                )}
                {isUserFriend && <Button className="cursor-pointer bg-red-500 hover:bg-red-600 text-xs font-semibold"  onClick={() => removeFriendfn(pageData._id)}>Remove  Friend</Button>}
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

export default UserDetails;
