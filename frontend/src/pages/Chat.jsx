import React, { useEffect, useRef, useState } from "react";
import BaseLayout from "../layouts/BaseLayout";
import SendMessage from "../components/SendMessage";
import ChatTopRibbon from "../components/ChatTopRibbon";
import MessageSendRow from "../components/MessageSendRow";
import MessageReceivedRow from "../components/MessageReceivedRow";
import { useParams } from "react-router-dom";
import {getUserChats} from  "../api/user";
import {ToastContainer} from  "react-toastify";
import  {handleError} from "../helpers/toastHelpers";
import  io  from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL,{
      auth: {
        token: localStorage.getItem('token')
      }
    });

function Chat() {
  
  const [userChats,setUserChats]  =  useState([]);  // for storing  previous  chats from database
  const  [message,setMessage] = useState('');  //  for storing input  messages   by the user

  const  [messages,setMessages] = useState([]);
  const  {username} =  useParams();

  const messageEndRef = useRef(null);  // Ref for the scrollable container

  useEffect(() =>  {
    const  main  = async ()=>  {
      try{
        const  response  = await   getUserChats(localStorage.getItem('token'),localStorage.getItem('user_name'),{
          friendUserName: username
        });

        if(response.status){
          setUserChats(response.data);
        }

      }catch(error){
        handleError(error.message);
      }
    }

    main();

    socket.emit('online',localStorage.getItem('user_name'));

    socket.on('receive_message',({from,message})=>{
      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg.receive_message === message);
        if (isDuplicate) return prev; // Return the current state if duplicate
        return [...prev, { receive_message: message }]; // Add new message if unique
      });
    })

  },[]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userChats]);


  const handleSendMessage = () => {
    if (message.trim()) {
        socket.emit('send_message', {to: username, message: message});
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => msg.send_message === message);
          if (isDuplicate) return prev; // Return the current state if duplicate
          return [...prev, { send_message: message }]; // Add new message if unique
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
                return <MessageReceivedRow message={val.message}  key={index} />;
              }else  if(val.sender_unique_id.username == localStorage.getItem('user_name')){
               return  <MessageSendRow message={val.message}   key={index} />;
              }
            })}

            {/* Chats Through Socket Io */}
            {Array.isArray(messages) && messages.length > 0 && messages.map((val,index) =>   {
              if(val['send_message']){
                return  <MessageSendRow message={val.send_message}   key={index} />;
              }else  if(val['receive_message']){
                return <MessageReceivedRow message={val.receive_message}  key={index} />;
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
