import React from "react";
import BaseLayout from "../layouts/BaseLayout";
import SendMessage from "../components/SendMessage";
import ChatTopRibbon from "../components/ChatTopRibbon";
import MessageSendRow from "../components/MessageSendRow";
import MessageReceivedRow from "../components/MessageReceivedRow";

function Chat() {
  return (
    <BaseLayout>
      <ChatTopRibbon />
      <div className="messageContainer md:h-[72vh] h-[80vh] mt-3 flex flex-col gap-4">
        <div className="messageArea border border-gray-700 bg-gray-800 p-4 rounded-lg overflow-y-auto scrollbar-hidden h-[65vh]">
          <div className="flex flex-col gap-2">
            <MessageReceivedRow message="Hi" />
            <MessageSendRow message="Hello" />
            <MessageReceivedRow message="Kese  Ho" />
            <MessageSendRow message="Mast  Ek Dum" />
            <MessageSendRow message="Tum  Btao" />
          </div>
        </div>
        <SendMessage />
      </div>
    </BaseLayout>
  );
}

export default Chat;
