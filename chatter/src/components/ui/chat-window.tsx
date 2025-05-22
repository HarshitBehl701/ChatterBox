"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

export function ChatWindow({ chatId }: { chatId: string }) {
  const messages: Message[] = [
    { id: "1", text: "Hey there!", sender: "them", time: "10:30 AM" },
    { id: "2", text: "Hi! How are you?", sender: "me", time: "10:32 AM" },
    { id: "3", text: "I'm good, thanks for asking. How about you?", sender: "them", time: "10:33 AM" },
    { id: "4", text: "Doing well! Just working on some projects.", sender: "me", time: "10:35 AM" },
    { id: "5", text: "That sounds interesting. What kind of projects?", sender: "them", time: "10:36 AM" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${chatId}`} />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">Chat with {chatId === "1" ? "John" : chatId === "2" ? "Jane" : "Team"}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>
                {message.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}