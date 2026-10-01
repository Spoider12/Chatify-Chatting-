import React, { useState } from "react";
import { ArrowLeft, Plus, Circle, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatifyStatusDrawer({ onClose }) {
  const { authUser } = useAuthStore();
  const { allContacts, theme } = useChatStore();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const isDark = theme === "dark";

  const sampleStatuses = [
    {
      id: "my-status",
      user: authUser,
      time: "Tap to add status update",
      isMine: true,
      media: null,
    },
    ...allContacts.slice(0, 4).map((contact, i) => ({
      id: contact._id,
      user: contact,
      time: i === 0 ? "Today, 4:20 PM" : i === 1 ? "Today, 1:15 PM" : "Yesterday, 9:40 PM",
      text: i === 0 ? "Chatify Chatting upgrade is awesome! 🚀" : i === 1 ? "Coding night ☕" : "Weekend trip 🌴",
      isMine: false,
    })),
  ];

  return (
    <div className={`absolute inset-0 z-40 flex transition-all duration-200 animate-in slide-in-from-left ${isDark ? "bg-[#0b0f19] text-slate-200" : "bg-white text-gray-800"}`}>
      {/* Left panel list */}
      <div className={`w-80 flex flex-col border-r ${isDark ? "bg-[#0b0f19] border-[#1f2937]" : "bg-slate-50 border-slate-200"}`}>
        <div className={`h-24 px-4 pb-3 flex items-end gap-6 font-semibold text-lg ${isDark ? "bg-[#111827] text-cyan-400" : "bg-gradient-to-r from-cyan-600 to-teal-600 text-white"}`}>
          <button onClick={onClose} className="p-1 hover:opacity-80 rounded-full">
            <ArrowLeft className="size-6" />
          </button>
          <span>Chatify Stories</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider">My Status</p>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="relative">
              <img src={authUser?.profilePic || "/avatar.png"} alt="me" className="size-12 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 p-0.5 bg-[#06b6d4] text-slate-950 rounded-full border-2 border-[#0b0f19]">
                <Plus className="size-3.5" />
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">My status</p>
              <p className="text-xs text-slate-400">Tap to add status update</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider pt-2">Recent Updates</p>
          {sampleStatuses.filter((s) => !s.isMine).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedStatus(item)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                selectedStatus?.id === item.id ? (isDark ? "bg-[#111827]" : "bg-gray-200") : "hover:bg-white/5"
              }`}
            >
              <div className="p-0.5 rounded-full border-2 border-[#06b6d4]">
                <img src={item.user.profilePic || "/avatar.png"} alt={item.user.fullName} className="size-11 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.user.fullName}</p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel story preview */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? "bg-[#070a11]" : "bg-slate-100"}`}>
        {selectedStatus ? (
          <div className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#6366f1] text-white shadow-2xl flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <img src={selectedStatus.user.profilePic || "/avatar.png"} alt="user" className="size-12 rounded-full border-2 border-white" />
              <div className="text-left">
                <p className="font-bold text-base">{selectedStatus.user.fullName}</p>
                <p className="text-xs opacity-80">{selectedStatus.time}</p>
              </div>
            </div>
            <p className="text-xl font-semibold text-center italic">{selectedStatus.text}</p>
            <Sparkles className="size-8 opacity-75 animate-bounce" />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 text-slate-400">
            <Circle className="size-16 stroke-1 text-[#06b6d4]" />
            <p className="text-sm font-medium">Click on a status to view Chatify story updates</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatifyStatusDrawer;
