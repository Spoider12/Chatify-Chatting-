import React, { useEffect } from "react";
import { ArrowLeft, Phone, Video, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function ChatHeader() {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup, typingUsers, theme } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isDark = theme === "dark";

  const target = selectedUser || selectedGroup;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
        setSelectedGroup(null);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser, setSelectedGroup]);

  if (!target) return null;

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);
  const isTyping = selectedUser && typingUsers[selectedUser._id];

  const handleCall = (type) => {
    toast(`Initiating Chatify ${type} call to ${target.fullName || target.name}...`, {
      icon: type === "video" ? "📹" : "📞",
      duration: 3000,
    });
  };

  return (
    <div className={`h-16 px-4 flex items-center justify-between border-b ${
      isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-100 border-slate-200"
    }`}>
      {/* Left info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors lg:hidden"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="relative shrink-0">
          <img
            src={target.profilePic || target.groupImage || "/avatar.png"}
            alt={target.fullName || target.name}
            className="size-10 rounded-full object-cover border border-[#06b6d4]/40"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-2.5 bg-cyan-400 rounded-full border border-[#111827]" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className={`text-sm font-semibold truncate ${isDark ? "text-slate-100" : "text-gray-900"}`}>
            {target.fullName || target.name}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {isTyping ? (
              <span className="text-[#06b6d4] font-medium italic animate-pulse">typing...</span>
            ) : isOnline ? (
              <span className="text-cyan-400 font-medium">online</span>
            ) : selectedUser?.about ? (
              selectedUser.about
            ) : (
              "offline"
            )}
          </p>
        </div>
      </div>

      {/* Right action icons */}
      <div className="flex items-center gap-1 text-slate-400">
        <button
          onClick={() => handleCall("video")}
          className="p-2 rounded-full hover:bg-white/10 hover:text-[#06b6d4] transition-colors"
          title="Start video call"
        >
          <Video className="size-5" />
        </button>

        <button
          onClick={() => handleCall("voice")}
          className="p-2 rounded-full hover:bg-white/10 hover:text-[#06b6d4] transition-colors"
          title="Start voice call"
        >
          <Phone className="size-5" />
        </button>

        <div className={`h-4 w-[1px] mx-1 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />

        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
          className="p-2 rounded-full hover:bg-white/10 hover:text-red-400 transition-colors"
          title="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
