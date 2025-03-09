import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

function CardComponent() {
  return (
    <>
    <div className="flex items-center justify-center h-full w-full p-6 ">
    <div className="relative w-full max-w-lg ">
        {/* Animated Gradient Border */}
         <div className="absolute inset-0 rounded-xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-border" />
            
        <Card className="relative w-full shadow-2xl rounded-xl border bg-transparent p-1 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center bg-gray-800 h-56 rounded-md text-white text-lg font-semibold space-y-4">
            <MessageCircle className="w-12 h-12 text-blue-500" />
            <p className="text-center">Start a conversation, messages will appear here...</p>
            <Button  className="cursor-pointer bg-blue-600 hover:bg-blue-700">Start  Chat</Button>
        </CardContent>
        </Card>
      </div>
      </div>
    </>
  )
}

export default CardComponent