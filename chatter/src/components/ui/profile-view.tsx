"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfileView() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://i.pravatar.cc/150?u=profile" />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-gray-500">@johndoe</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">About</h3>
          <p className="mt-1">Digital designer & front-end developer</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1">john@example.com</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Joined</h3>
          <p className="mt-1">January 2023</p>
        </div>
      </div>
      
      <Button className="w-full">Edit Profile</Button>
    </div>
  );
}