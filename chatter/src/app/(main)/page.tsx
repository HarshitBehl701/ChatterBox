import { ChatWindow } from "@/components/ui/chat-window";
import { ProfileView } from "@/components/ui/profile-view";

export default function Home() {
  return (
    <div className="lg:ml-72 h-full flex">
      <div className="flex-1 border-r hidden lg:block">
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a chat</h2>
            <p className="text-gray-500">
              Choose a conversation from the sidebar or start a new one
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-80 xl:w-96 border-l">
        <ProfileView />
      </div>
    </div>
  );
}