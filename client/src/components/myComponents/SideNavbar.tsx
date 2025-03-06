import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, MessageSquare, Users } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import EditProfilePopup from "./EditProfile";
import { useUserContext } from "@/contexts/userContext";
import { getImagePathUrl } from "@/utils/commonUtils";

function SideNavbar() {
  const navigate  =  useNavigate();
  const {userData} = useUserContext();
  return (
    <>
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center p-4 space-y-3">
      <EditProfilePopup  trigger={<Avatar>
        <AvatarImage src={getImagePathUrl('user',userData?.picture   ?? '')} className="cursor-pointer  object-cover  object-center" />
        <AvatarFallback>
          <img src="https://github.com/shadcn.png" className="cursor-pointer" />
        </AvatarFallback>
      </Avatar>} />
        <div className="menus flex flex-col  items-center justify-between h-full">
          <ul  className="space-y-4">
            <li className="cursor-pointer hover:bg-gray-800 p-2 rounded-md"  onClick={() =>  navigate('/users')}><MessageSquare className="h-7 w-7 cursor-pointer" /></li>
            <li className="cursor-pointer hover:bg-gray-800 p-2 rounded-md" onClick={() =>  navigate('/groups')}><Users className="h-7 w-7 cursor-pointer" /></li>
          </ul>
          <ul>
          <li className="hover:bg-red-800 p-2 rounded-md cursor-pointer group" onClick={() => navigate('/logout')}><LogOut className="h-7 w-7 group-hover:text-white cursor-pointer text-red-500  hover:text-white" /></li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default SideNavbar