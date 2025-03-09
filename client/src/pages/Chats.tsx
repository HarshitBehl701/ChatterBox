import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Dot, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IChatModal, IGroupChatModal, IGroupModal, IUserModal } from "@/interfaces/commonInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUserContext } from "@/contexts/userContext";
import { getImagePathUrl, handleCatchErrors } from "@/utils/commonUtils";
import { getUserChats } from "@/api/userApi";
import { getGroupChats } from "@/api/groupApi";
import { useSocketContext } from "@/contexts/socketContext";

export default function Chats() {
  const {type} = useParams();
  const  location =  useLocation();
  const navigate  = useNavigate();
  const [mainData] = useState<IUserModal|IGroupModal>(location.state ||  {});
  const {userData}   = useUserContext();
  const [messages, setMessages] = useState<IChatModal[] | IGroupChatModal[] |  null>(null);
  const [newMessage, setNewMessage] = useState("");
  const divRef  =  useRef<HTMLDivElement  | null>(null);
  const {sendGroupMessage,sendUserMessage,newMessageReceived,setNewMessageReceived,setCurrentPage,currentPage,joinGroup} = useSocketContext();

  const sendMessage = useCallback((ev:FormEvent) => {
    ev.preventDefault();
    if (newMessage.trim() === "") return;
    if (type?.includes("user") && Array.isArray(messages)) {
      const newMsg: IChatModal = {
        sender_unique_id: userData as  IUserModal,
        receiver_unique_id: mainData as IUserModal,
        message: newMessage,
        status: "sent",
        is_active: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      setMessages((prev) => (prev ? [...(prev as IChatModal[]), newMsg] : [newMsg]));
    } else if (type?.includes("group") && Array.isArray(messages)) {
      const newMsg: IGroupChatModal = {
        sender_user_id: userData as IUserModal,
        group_id: mainData as IGroupModal,
        message: newMessage,
        status: "sent",
        is_active: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMessages((prev) => (prev ? [...(prev as IGroupChatModal[]), newMsg] : [newMsg]));
    }


    //sockets
    if(type && type.includes('user'))
      sendUserMessage(newMessage,mainData as IUserModal)
    else if(type &&  type.includes('group'))
      sendGroupMessage(newMessage,mainData as IGroupModal)

    //sockets
  
    setNewMessage("");
  }, [newMessage,type,sendGroupMessage,sendUserMessage,messages,userData,mainData]);
  
  useEffect(() => {
    if(type !==   currentPage)
      setCurrentPage(type as string);
  },[type,currentPage,setCurrentPage]);

  useEffect(() =>  {
    if(newMessageReceived)
    {
      if(type?.includes("user"))
      {
        const newMsg: IChatModal = {
          sender_unique_id: newMessageReceived.from,
          receiver_unique_id: userData  as  IUserModal,
          message: newMessageReceived.message,
          status: "sent",
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMessages((prev) => (prev ? [...(prev as IChatModal[]), newMsg] : [newMsg]));
        setNewMessageReceived(null);
      }else if(type?.includes("group"))
      {
        const newMsg: IGroupChatModal = {
          sender_user_id: newMessageReceived.from,
          group_id: newMessageReceived.to as IGroupModal,
          message: newMessageReceived.message,
          status: "sent",
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMessages((prev) => (prev ? [...(prev as IGroupChatModal[]), newMsg] : [newMsg]));  
        setNewMessageReceived(null);
      }
    }
  },[newMessageReceived,type,userData,setNewMessageReceived]);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages,newMessage]);

  useEffect(() =>  {
    if(messages  ===  null && type)
    {
      if(type.includes('group'))  joinGroup(mainData   as IGroupModal);
      ;(async() =>{
        try {
          const response   = type.includes('user')  ?  await getUserChats({friend_id:mainData._id}) :  await getGroupChats({group_id:mainData._id});
          if(response.status)
          {
            setMessages(type.includes("user") ?  response.data.chats : response.data.groupChats);
          }else
          {
            setMessages([]);
            throw new  Error(response.message);
          }
          
        } catch (error) {
          setMessages([]);
          throw new  Error(handleCatchErrors(error));
        }
      })()
    }
  },[messages,type,mainData,joinGroup]);

  return (
    <>
        <Card className="flex bg-gray-800 flex-col rounded-none h-[100dvh] border-0 outline-0 shadow-none   text-white">
        <CardHeader className="cursor-pointer" onClick={() => navigate(`/${type}/${mainData.name}/details`,{state:mainData})}>
            {/* Left Side - Avatar */}
            <div className="flex items-center space-x-3">
              <ChevronLeft onClick={()=> window.history.back()} />
            <div className="image relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={getImagePathUrl(
                      "username" in mainData ? "user" : "group",
                      mainData.picture
                    )}
                    className="cursor-pointer w-12 h-12 rounded-full object-cover object-center"
                  />
                  <AvatarFallback>
                    <img
                      src="https://github.com/shadcn.png"
                      className="cursor-pointer w-12 h-12 rounded-full object-cover object-center"
                    />
                  </AvatarFallback>
                </Avatar>
                <Dot
                  className={`scale-200 -bottom-1 -right-1 absolute ${
                    (mainData.status  === 'online' || mainData.status  === 'active') ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
              <span className="font-medium">{'adminUserId' in mainData ? (mainData  as   IGroupModal).name : (mainData as IUserModal).username}</span>
              <p className="text-xs">{'adminUserId' in mainData ? ((mainData  as   IGroupModal).members.length >  0 ? (mainData  as   IGroupModal).members.length  + ' Members' :  '') : (mainData as IUserModal).name}</p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto space-y-3 p-4  min-h-0">
            {Array.isArray(messages)  &&  messages.length > 0 && messages.map((msg) => (
              <div
                key={Math.random()}
                className={`flex ${(type?.includes('user') ? ((msg as  IChatModal).receiver_unique_id._id  === userData?._id ? 'justify-start' : 'justify-end') : (type?.includes('group') ? ((msg as  IGroupChatModal).sender_user_id._id  === userData?._id ? 'justify-end' : 'justify-start') : ""))}`}
                ref={divRef}
                >

                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    type?.includes('user') ? ((msg as  IChatModal).receiver_unique_id._id  === userData?._id ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white') : (type?.includes('group') ? ((msg as  IGroupChatModal).sender_user_id._id  === userData?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black') : "")
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {!messages || !(Array.isArray(messages) && messages.length  > 0) && <p className="italic">No  Chats Yet...</p>}
          </CardContent>
          <form onSubmit={sendMessage}>
          <div className="p-3 flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          </form>
        </Card>
    </>
  );
}
