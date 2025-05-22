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
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  { id: "4", name: "Alice Johnson", email: "alice@example.com" },
  { id: "5", name: "Bob Smith", email: "bob@example.com" },
  { id: "6", name: "Charlie Brown", email: "charlie@example.com" },
];

export function NewChatDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-2">
          <MessageSquare className="h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a new chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}