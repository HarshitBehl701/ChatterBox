"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

const users = [
  { id: "4", name: "Alice Johnson" },
  { id: "5", name: "Bob Smith" },
  { id: "6", name: "Charlie Brown" },
  { id: "7", name: "Diana Prince" },
  { id: "8", name: "Evan Peters" },
];

export function NewGroupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-2">
          <Users className="h-4 w-4" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="group-name" className="block text-sm font-medium mb-1">
              Group name
            </label>
            <Input id="group-name" placeholder="Enter group name" />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <Checkbox id={`user-${user.id}`} className="mr-3" />
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                  {user.name}
                </label>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4">Create Group</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}