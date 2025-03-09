import RightPanel from "@/components/myComponents/RightPanel";
import SideNavbar from "@/components/myComponents/SideNavbar";
import { ReactNode } from "react";

export default function BaseLayout({children}:{children:ReactNode}) {

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <SideNavbar />

      {/* Chat Section */}
      <div className="flex-1 bg-gray-800 text-white flex flex-col md:w-full w-[70%]">
       {children}
      </div>

      {/* Right Panel */}
      <RightPanel />      
    </div>
  );
}