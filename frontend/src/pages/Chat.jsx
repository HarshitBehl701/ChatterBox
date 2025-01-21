import React, { useEffect, useRef, useState } from "react";
import BaseLayout from "../layouts/BaseLayout";
import SendMessage from "../components/SendMessage";
import ChatTopRibbon from "../components/ChatTopRibbon";
import MessageSendRow from "../components/MessageSendRow";
import MessageReceivedRow from "../components/MessageReceivedRow";
import { useParams } from "react-router-dom";
import {getUserChats, getUserProfilePicture} from  "../api/user";
import {ToastContainer} from  "react-toastify";
import  {handleError} from "../helpers/toastHelpers";
import { getSocket } from "../helpers/socket";

function Chat() {  
  const socket = getSocket("user");
  const  [receiverProfilePicture,setReceiverProfilePicture] = useState("");
  const  [senderProfilePicture,setSenderProfilePicture] = useState("");
  
  const [userChats,setUserChats]  =  useState([]);  // for storing  previous  chats from database
  const  [message,setMessage] = useState('');  //  for storing input  messages   by the user

  const  [messages,setMessages] = useState([]);
  const  {username} =  useParams();

  const messageEndRef = useRef(null);  // Ref for the scrollable container

  useEffect(() =>  {
    const  main  = async ()=>  {
      try{
        const  userChatResponse  = await   getUserChats(localStorage.getItem('token'),localStorage.getItem('user_name'),{
          friendUserName: username
        });

        const receiverProfilePictureResponse  =  await getUserProfilePicture(localStorage.getItem('token'),localStorage.getItem('user_name'),username)

        const senderProfilePictureResponse  =  await getUserProfilePicture(localStorage.getItem('token'),localStorage.getItem('user_name'),localStorage.getItem('user_name'))

        if(userChatResponse.status){
          setUserChats(userChatResponse.data);
        }else{
          handleError(userChatResponse.message)
        }
        
        if(receiverProfilePictureResponse.status){
          setReceiverProfilePicture(receiverProfilePictureResponse.data);
        }else{
          handleError(receiverProfilePictureResponse.message)
        }
        
        if(senderProfilePictureResponse.status){
          setSenderProfilePicture(senderProfilePictureResponse.data);
        }else{
          handleError(senderProfilePictureResponse.message)
        }

      }catch(error){
        handleError(error.message);
      }
    }

    main();

    socket.emit('online',localStorage.getItem('user_name'));

    socket.on('receive_user_chat_message',({from,message})=>{
      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg.receive_user_chat_message === message);
        if (isDuplicate) return prev; // Return the current state if duplicate
        return [...prev, { receive_user_chat_message: message }]; // Add new message if unique
      });
    })

    return () => {
      socket.off("receive_user_chat_message"); // Cleanup listener on unmount
    };
  },[]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userChats]);


  const handleSendMessage = () => {
    if (message.trim()) {
        socket.emit('send_user_chat_message', {to: username, message: message});
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => msg.send_user_chat_message === message);
          if (isDuplicate) return prev; // Return the current state if duplicate
          return [...prev, { send_user_chat_message: message }]; // Add new message if unique
        });
        setMessage('');
    }
  };

  const  handleMessageInputEvent = (ev) => {
    setMessage(ev.target.value);
  }

  return (
    <BaseLayout>
      <ChatTopRibbon  username={username} />
      <div className="messageContainer md:h-[72vh] h-[80vh] mt-3 flex flex-col gap-4">
        <div className="messageArea border border-gray-700 bg-gray-800 p-4 rounded-lg overflow-y-auto scrollbar-hidden h-[65vh]">
          <div className="flex flex-col gap-2">
            {/* Previous Chats From Database */}
            {Array.isArray(userChats)  && userChats.length   >  0 &&   userChats.map((val,index)   => { 
              if(val.receiver_unique_id.username == localStorage.getItem('user_name')){
                return <MessageReceivedRow message={val.message}  key={index}  profilePicture={receiverProfilePicture} />;
              }else  if(val.sender_unique_id.username == localStorage.getItem('user_name')){
               return  <MessageSendRow message={val.message}   key={index} profilePicture={senderProfilePicture} />;
              }
            })}

            {/* Chats Through Socket Io */}
            {Array.isArray(messages) && messages.length > 0 && messages.map((val,index) =>   {
              if(val['send_user_chat_message']){
                return  <MessageSendRow message={val.send_user_chat_message}   key={index} profilePicture={senderProfilePicture}   />;
              }else  if(val['receive_user_chat_message']){
                return <MessageReceivedRow message={val.receive_user_chat_message}  key={index} profilePicture={receiverProfilePicture} />;
              }
            })}


        <div ref={messageEndRef}></div>
          </div>
        </div>
        <SendMessage
          handleMessageInputEvent={handleMessageInputEvent}
          handleSendMessage={handleSendMessage}
          message={message}
          setMessage={setMessage}
        />
      </div>
      <ToastContainer  />
    </BaseLayout>
  );
}

export default Chat;
