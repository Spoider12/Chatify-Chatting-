import React, { useState } from "react";
import { ArrowLeft, Plus, Circle, Image, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function WhatsAppStatusDrawer({ onClose }) {
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
      text: i === 0 ? "Working on exciting new WhatsApp feature! 🚀" : i === 1 ? "Enjoying coffee ☕" : "Chilling weekend 🌴",
      isMine: false,
    })),
  ];

  return (
    <div className={`absolute inset-0 z-40 flex transition-all duration-200 animate-in slide-in-from-left ${isDark ? "bg-[#111b21] text-slate-200" : "bg-white text-gray-800"}`}>
      {/* Left panel list */}
      <div className={`w-80 flex flex-col border-r ${isDark ? "bg-[#111b21] border-[#222d34]" : "bg-gray-50 border-gray-200"}`}>
        <div className={`h-24 px-4 pb-3 flex items-end gap-6 font-semibold text-lg ${isDark ? "bg-[#202c33]" : "bg-[#008069] text-white"}`}>
          <button onClick={onClose} className="p-1 hover:opacity-80 rounded-full">
            <ArrowLeft className="size-6" />
          </button>
          <span>Status</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider">My Status</p>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="relative">
              <img src={authUser?.profilePic || "/avatar.png"} alt="me" className="size-12 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 p-0.5 bg-[#00a884] text-white rounded-full border-2 border-[#111b21]">
                <Plus className="size-3.5" />
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">My status</p>
              <p className="text-xs text-[#8696a0]">Tap to add status update</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider pt-2">Recent Updates</p>
          {sampleStatuses.filter((s) => !s.isMine).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedStatus(item)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                selectedStatus?.id === item.id ? (isDark ? "bg-[#202c33]" : "bg-gray-200") : "hover:bg-white/5"
              }`}
            >
              <div className="p-0.5 rounded-full border-2 border-[#00a884]">
                <img src={item.user.profilePic || "/avatar.png"} alt={item.user.fullName} className="size-11 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.user.fullName}</p>
                <p className="text-xs text-[#8696a0]">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel story preview */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? "bg-[#0b141a]" : "bg-[#f0f2f5]"}`}>
        {selectedStatus ? (
          <div className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-br from-[#00a884] to-[#005c4b] text-white shadow-2xl flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <img src={selectedStatus.user.profilePic || "/avatar.png"} alt="user" className="size-12 rounded-full border-2 border-white" />
              <div className="text-left">
                <p className="font-bold text-base">{selectedStatus.user.fullName}</p>
                <p className="text-xs opacity-80">{selectedStatus.time}</p>
              </div>
            </div>
            <p className="text-xl font-semibold text-center italic">{selectedStatus.text}</p>
            <Sparkles className="size-8 opacity-60 animate-bounce" />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 text-[#8696a0]">
            <Circle className="size-16 stroke-1 text-[#00a884]" />
            <p className="text-sm font-medium">Click on a status to view story updates</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsAppStatusDrawer;
