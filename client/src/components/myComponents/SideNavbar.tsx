import { useState } from "react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, MessageSquare, Users, ChevronLeft } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import EditProfilePopup from "./EditProfile";
import { useUserContext } from "@/contexts/userContext";
import { getImagePathUrl } from "@/utils/commonUtils";

function SideNavbar() {
  const navigate = useNavigate();
  const { userData } = useUserContext();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        className={`fixed md:hidden top-1/2 ${isOpen ?'left-16':'left-0'} hover:bg-gray-900 text-white p-2 rounded-md z-50`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen &&  <ChevronLeft className="h-8 w-8 text-gray-700  hover:text-white" />}
        {isOpen  && <p className="text-2xl text-gray-700  hover:text-white">|</p>}
      </button>
      
      <div
        className={`h-full bg-gray-900  overflow-hidden text-white flex flex-col items-center space-y-3 transition-transform duration-300 ${
          isOpen ? "w-16 p-4" : "w-0  p-0"
        }`}
      >
        <EditProfilePopup
          trigger={
            <Avatar>
              <AvatarImage
                src={getImagePathUrl("user", userData?.picture ?? "")}
                className="cursor-pointer object-cover object-center"
              />
              <AvatarFallback>
                <img
                  src="https://github.com/shadcn.png"
                  className="cursor-pointer"
                />
              </AvatarFallback>
            </Avatar>
          }
        />
        <div className="menus flex flex-col items-center justify-between h-full">
          <ul className="space-y-4">
            <li
              className="cursor-pointer hover:bg-gray-800 p-2 rounded-md"
              onClick={() => navigate("/users")}
            >
              <MessageSquare className="h-7 w-7" />
            </li>
            <li
              className="cursor-pointer hover:bg-gray-800 p-2 rounded-md"
              onClick={() => navigate("/groups")}
            >
              <Users className="h-7 w-7" />
            </li>
          </ul>
          <ul>
            <li
              className="hover:bg-red-800 p-2 rounded-md cursor-pointer group"
              onClick={() => navigate("/logout")}
            >
              <LogOut className="h-7 w-7 group-hover:text-white text-red-500" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideNavbar;