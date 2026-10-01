import React, { useEffect } from "react";
import { CheckCheck, Mic, Image as ImageIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    selectedUser,
    setSelectedUser,
    searchQuery,
    chatFilter,
    typingUsers,
    theme,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const isDark = theme === "dark";

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    if (chatFilter === "unread") {
      return matchesSearch && chat.unreadCount > 0;
    }
    return matchesSearch;
  });

  if (filteredChats.length === 0) return <NoChatsFound />;

  const formatLastMessageTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="divide-y divide-slate-800/40">
      {filteredChats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isSelected = selectedUser?._id === chat._id;
        const isTyping = typingUsers[chat._id];
        const lastMsg = chat.lastMessage;
        const isMyLastMsg = lastMsg?.senderId === authUser?._id;

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`px-3 py-3 flex items-center gap-3 cursor-pointer transition-colors relative ${
              isSelected
                ? isDark
                  ? "bg-[#1f2937] border-l-4 border-[#06b6d4]"
                  : "bg-cyan-50 border-l-4 border-[#06b6d4]"
                : isDark
                ? "hover:bg-[#111827]"
                : "hover:bg-slate-100"
            }`}
          >
            {/* Avatar & Online status badge */}
            <div className="relative shrink-0">
              <img
                src={chat.profilePic || "/avatar.png"}
                alt={chat.fullName}
                className="size-12 rounded-full object-cover"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-cyan-400 rounded-full border-2 border-[#0b0f19]" />
              )}
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-semibold truncate ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                  {chat.fullName}
                </h4>
                <span className={`text-[11px] ${chat.unreadCount > 0 ? "text-[#06b6d4] font-bold" : "text-slate-400"}`}>
                  {formatLastMessageTime(lastMsg?.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs truncate flex items-center gap-1 min-w-0">
                  {isTyping ? (
                    <span className="text-[#06b6d4] font-medium italic animate-pulse">typing...</span>
                  ) : (
                    <>
                      {isMyLastMsg && (
                        <span className="shrink-0">
                          {lastMsg?.isRead ? (
                            <CheckCheck className="size-4 text-[#22d3ee]" />
                          ) : (
                            <CheckCheck className="size-4 text-slate-400" />
                          )}
                        </span>
                      )}

                      {lastMsg?.audio ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Mic className="size-3.5 text-[#06b6d4]" />
                          <span>Voice message</span>
                        </span>
                      ) : lastMsg?.image ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <ImageIcon className="size-3.5" />
                          <span>Photo</span>
                        </span>
                      ) : (
                        <span className={`truncate ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                          {lastMsg?.text || "Click to start chatting"}
                        </span>
                      )}
                    </>
                  )}
                </p>

                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#06b6d4] text-[10px] font-bold text-slate-950">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;