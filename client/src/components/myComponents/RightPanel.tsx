import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useUserContext } from "@/contexts/userContext";
import { formatDate, getImagePathUrl } from "@/utils/commonUtils";
import EditProfilePopup from "./EditProfile";

function RightPanel() {
  const {userData} =   useUserContext();
  return (
    <>
        <div className="w-64 bg-gray-700 text-white p-4 md:block hidden">
            <h3 className="text-lg font-semibold">User Info</h3>
            <Separator className="my-2" />
            <div className="flex flex-col items-center space-x-3">
            <Avatar className="w-20   h-20">
              <AvatarImage src={getImagePathUrl('user',userData?.picture??'')} className="cursor-pointer object-cover object-center" />
              <AvatarFallback>
                <img src="https://github.com/shadcn.png" className="cursor-pointer" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{userData?.name} <small>({userData?.username})</small></span>
            <span className="font-medium text-xs">Joined On :   {formatDate(userData?.createdAt  ?? new Date())}</span>
            <span className="font-medium text-xs">Last Updated :   {formatDate(userData?.updatedAt  ?? new Date())}</span>
            <EditProfilePopup trigger={<Button className="mt-4 bg-blue-600 hover:bg-blue-700    cursor-pointer   text-xs  font-semibold">Edit Profile</Button>} />
            </div>
        </div>
    </>
  )
}

export default RightPanel