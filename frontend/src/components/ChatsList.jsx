import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      
      
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
              <p className="text-sm text-slate-400 truncate">
                {chat.lastMessage?.text || (chat.lastMessage?.image ? "Photo" : "Start a conversation")}
              </p>
            </div>
            {chat.unreadCount > 0 && (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white"
                title={`${chat.unreadCount} unread ${chat.unreadCount === 1 ? "message" : "messages"}`}
              >
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;