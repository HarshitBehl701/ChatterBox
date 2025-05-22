"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { NewChatDialog } from "./new-chat-dialog";
import { NewGroupDialog } from "./new-group-dialog";
import { motion } from "framer-motion";
import { Menu, Search, MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const chats = [
  { id: "1", name: "John Doe", lastMessage: "Hey, how are you?", unread: 2 },
  { id: "2", name: "Jane Smith", lastMessage: "Meeting at 3pm", unread: 0 },
  { id: "3", name: "Team Project", lastMessage: "Alice: I've pushed the changes", unread: 5 },
];

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <DesktopSidebarContent />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r">
        <DesktopSidebarContent />
      </div>
    </>
  );
}

function DesktopSidebarContent() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Chattijg</h1>
          <Toggle aria-label="Toggle dark mode">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </Toggle>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats..."
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 flex gap-2">
        <NewChatDialog />
        <NewGroupDialog />
      </div>
      
      {/* Chats list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link
              href={`/chat/${chat.id}`}
              className={`flex items-center p-3 rounded-lg transition-colors ${pathname === `/chat/${chat.id}` ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${chat.id}`} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* User profile */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="https://i.pravatar.cc/150?u=user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">Your Name</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}