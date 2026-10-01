import React from "react";
import { MessageSquare, Users, UserPlus } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab, theme } = useChatStore();
  const isDark = theme === "dark";

  return (
    <div className={`flex border-b text-xs font-semibold ${isDark ? "bg-[#0b0f19] border-[#1f2937]" : "bg-white border-slate-200"}`}>
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
          activeTab === "chats"
            ? "border-[#06b6d4] text-[#06b6d4]"
            : isDark
            ? "border-transparent text-slate-400 hover:text-slate-200"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        <MessageSquare className="size-4" />
        <span>Chats</span>
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
          activeTab === "contacts"
            ? "border-[#06b6d4] text-[#06b6d4]"
            : isDark
            ? "border-transparent text-slate-400 hover:text-slate-200"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        <UserPlus className="size-4" />
        <span>Contacts</span>
      </button>

      <button
        onClick={() => setActiveTab("groups")}
        className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
          activeTab === "groups"
            ? "border-[#06b6d4] text-[#06b6d4]"
            : isDark
            ? "border-transparent text-slate-400 hover:text-slate-200"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        <Users className="size-4" />
        <span>Groups</span>
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
