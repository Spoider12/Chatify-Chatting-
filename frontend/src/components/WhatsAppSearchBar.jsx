import React from "react";
import { Search, Filter, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function WhatsAppSearchBar() {
  const { searchQuery, setSearchQuery, chatFilter, setChatFilter, theme } = useChatStore();

  const isDark = theme === "dark";

  return (
    <div className={`p-2.5 space-y-2 border-b ${isDark ? "bg-[#111b21] border-[#222d34]" : "bg-white border-gray-200"}`}>
      {/* Search Input */}
      <div className={`relative flex items-center rounded-lg px-3 py-1.5 ${isDark ? "bg-[#202c33]" : "bg-[#f0f2f5]"}`}>
        <Search className={`size-4 mr-3 ${isDark ? "text-[#8696a0]" : "text-gray-500"}`} />
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-transparent text-sm focus:outline-none ${
            isDark ? "text-slate-200 placeholder-[#8696a0]" : "text-gray-800 placeholder-gray-500"
          }`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-[#8696a0] hover:text-white p-0.5">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setChatFilter("all")}
          className={`px-3 py-1 rounded-full font-medium transition-colors ${
            chatFilter === "all"
              ? isDark
                ? "bg-[#00a884] text-[#111b21]"
                : "bg-[#008069] text-white"
              : isDark
              ? "bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setChatFilter("unread")}
          className={`px-3 py-1 rounded-full font-medium transition-colors ${
            chatFilter === "unread"
              ? isDark
                ? "bg-[#00a884] text-[#111b21]"
                : "bg-[#008069] text-white"
              : isDark
              ? "bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setChatFilter("groups")}
          className={`px-3 py-1 rounded-full font-medium transition-colors ${
            chatFilter === "groups"
              ? isDark
                ? "bg-[#00a884] text-[#111b21]"
                : "bg-[#008069] text-white"
              : isDark
              ? "bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Groups
        </button>
      </div>
    </div>
  );
}

export default WhatsAppSearchBar;
