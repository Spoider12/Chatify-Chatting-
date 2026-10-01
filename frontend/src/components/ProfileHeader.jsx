import React from "react";
import { Circle, MessageSquarePlus, Users, Settings, Moon, Sun, LogOut, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ProfileHeader() {
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme, setActiveDrawer, setActiveTab, activeTab } = useChatStore();

  const isDark = theme === "dark";

  return (
    <div className={`h-16 px-4 flex items-center justify-between border-b ${
      isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-100 border-slate-200"
    }`}>
      {/* User Avatar & Chatify Branding */}
      <button
        onClick={() => setActiveDrawer("settings")}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
        title="View profile & settings"
      >
        <div className="relative size-10 rounded-full overflow-hidden border-2 border-[#06b6d4]">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-full object-cover"
          />
          <span className="absolute bottom-0 right-0 size-2.5 bg-cyan-400 rounded-full border border-[#111827]" />
        </div>
        <div className="hidden sm:block">
          <h3 className={`text-sm font-semibold truncate max-w-[120px] ${isDark ? "text-slate-100" : "text-gray-900"}`}>
            {authUser?.fullName}
          </h3>
          <p className="text-[11px] text-[#06b6d4] font-bold tracking-wider uppercase">Chatify</p>
        </div>
      </button>

      {/* Header Navigation Actions */}
      <div className="flex items-center gap-1.5 text-slate-400">
        <button
          onClick={() => setActiveDrawer("status")}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isDark ? "hover:text-slate-200" : "hover:text-gray-900"}`}
          title="Stories"
        >
          <Circle className="size-5 stroke-[2]" />
        </button>

        <button
          onClick={() => setActiveTab("groups")}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
            activeTab === "groups" ? "text-[#06b6d4]" : isDark ? "hover:text-slate-200" : "hover:text-gray-900"
          }`}
          title="Groups"
        >
          <Users className="size-5" />
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
            activeTab === "contacts" ? "text-[#06b6d4]" : isDark ? "hover:text-slate-200" : "hover:text-gray-900"
          }`}
          title="New Chat / Contacts"
        >
          <MessageSquarePlus className="size-5" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isDark ? "hover:text-amber-400" : "hover:text-indigo-600"}`}
          title="Switch Theme"
        >
          {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-indigo-600" />}
        </button>

        <button
          onClick={() => setActiveDrawer("settings")}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isDark ? "hover:text-slate-200" : "hover:text-gray-900"}`}
          title="Settings"
        >
          <Settings className="size-5" />
        </button>

        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
          title="Logout"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
