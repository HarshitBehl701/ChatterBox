import React, { useEffect, useRef, useState } from "react";
import BaseLayout from "../layouts/BaseLayout";
import SendMessage from "../components/SendMessage";
import GroupChatRibbon from "../components/GroupChatRibbon";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../helpers/toastHelpers";
import GroupMessageReceivedRow from "../components/GroupMessageReceivedRow";
import GroupMessageSendRow from "../components/GroupMessageSendRow";
import { getSocket } from "../helpers/socket";
import { getGroupPreviousChats } from "../helpers/groupHelpers";
import { ToastContainer } from "react-toastify";

function GroupChat() {
  const navigate = useNavigate();
  const socket = getSocket("group");
  const [groupId, setGroupId] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]); //for  fetching previous chats in this group
  const [messages, setMessages] = useState([]); //for Setting group current  chats
  const [message, setMessage] = useState(""); //for handling  user sent message input
  const { groupname } = useParams();
  const messageEndRef = useRef(null);
  const [isSendMessageBtnHidden, setIsMessageBtnHidden] = useState(true);
  const [groupPicture, setGroupPicture] = useState("");

  useEffect(() => {
    const main = async () => {
      const groupChatsRespone = await getGroupPreviousChats(groupname);

      if (groupChatsRespone.status) {
        setGroupMessages(groupChatsRespone.data.chats);
        setGroupId(groupChatsRespone.data.groupId);
        setGroupPicture(groupChatsRespone.data.picture);
      } else {
        navigate('/groups');
        handleError(groupChatsRespone.message);
      }
    };

    main();
  }, []);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    setIsMessageBtnHidden(false);

    socket.emit("group_join", {
      groupId: groupId,
    });

    socket.on(
      "receive_group_chat_message",
      ({ username, picture, message }) => {
        setMessages((prev) => {
          return [
            ...prev,
            { username: username, message: message, picture: picture },
          ]; //for  unique messages fetching  only
        });
      }
    );

    return () => {
      socket.off("receive_group_chat_message");
    };
  }, [groupId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages, messages]);

  const handleMessageInputEvent = (ev) => {
    setMessage(ev.target.value);
  };

  const handleSendMessage = async () => {
    socket.emit("send_group_chat_message", {
      groupId: groupId,
      message: message,
    });
    setMessage("");
  };


  return (
    <BaseLayout>
      <GroupChatRibbon groupname={groupname} groupPicture={groupPicture} />
      <div className="messageContainer md:h-[72vh] h-[80vh] mt-3 flex flex-col gap-4">
        <div className="messageArea border border-gray-700 bg-gray-800 p-4 rounded-lg overflow-y-auto scrollbar-hidden h-[65vh]">
          <div className="flex flex-col gap-2">
            {/* previous  chats */}
            {groupMessages.map((val, index) => {
              if (
                val.sender_unique_id.username !==
                localStorage.getItem("user_name")
              ) {
                return (
                  <GroupMessageReceivedRow
                    message={val.message}
                    key={index}
                    username={val.sender_unique_id.username}
                    picture={val.sender_unique_id.picture}
                  />
                );
              } else if (
                val.sender_unique_id.username ==
                localStorage.getItem("user_name")
              ) {
                return (
                  <GroupMessageSendRow
                    message={val.message}
                    username={val.sender_unique_id.username}
                    key={index}
                    picture={val.sender_unique_id.picture}
                  />
                );
              }
            })}

            {/* live chats */}
            {messages.map((val, index) => {
              if (val.username !== localStorage.getItem("user_name")) {
                return (
                  <GroupMessageReceivedRow
                    message={val.message}
                    key={index}
                    username={val.username}
                    picture={val.picture}
                  />
                );
              } else if (val.username == localStorage.getItem("user_name")) {
                return (
                  <GroupMessageSendRow
                    message={val.message}
                    username={val.username}
                    picture={val.picture}
                    key={index}
                  />
                );
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
          isSendMessageBtnHidden={isSendMessageBtnHidden}
        />
      </div>
      <ToastContainer />
    </BaseLayout>
  );
}

export default GroupChat;
