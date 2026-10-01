import React, { useState, useRef } from "react";
import { ArrowLeft, Camera, Edit2, Check, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatifySettingsDrawer({ onClose }) {
  const { authUser, updateProfile } = useAuthStore();
  const { theme, toggleTheme, isSoundEnabled, toggleSound } = useChatStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about, setAbout] = useState(authUser?.about || "Hey there! I am using Chatify");

  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const isDark = theme === "dark";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSaveName = async () => {
    if (!fullName.trim()) return;
    await updateProfile({ fullName });
    setIsEditingName(false);
  };

  const handleSaveAbout = async () => {
    await updateProfile({ about });
    setIsEditingAbout(false);
  };

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col transition-all duration-200 animate-in slide-in-from-left ${
        isDark ? "bg-[#0b0f19] text-slate-200" : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className={`h-24 px-4 pb-3 flex items-end gap-6 font-semibold text-lg ${
        isDark ? "bg-[#111827] text-cyan-400" : "bg-gradient-to-r from-cyan-600 to-teal-600 text-white"
      }`}>
        <button onClick={onClose} className="p-1 hover:opacity-80 rounded-full transition-opacity">
          <ArrowLeft className="size-6" />
        </button>
        <span>Profile & Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative group size-40 rounded-full overflow-hidden shadow-xl border-2 border-[#06b6d4]">
            <img
              src={selectedImg || authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs gap-1 transition-opacity cursor-pointer"
            >
              <Camera className="size-7 text-cyan-400" />
              <span>CHANGE PHOTO</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Name section */}
        <div className={`p-4 rounded-xl space-y-2 border ${isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider">Your Name</p>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full bg-transparent border-b-2 border-[#06b6d4] py-1 text-base focus:outline-none ${
                  isDark ? "text-slate-100" : "text-gray-900"
                }`}
              />
              <button onClick={handleSaveName} className="p-1.5 bg-[#06b6d4] text-slate-950 font-bold rounded-full">
                <Check className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">{authUser?.fullName}</span>
              <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-[#06b6d4]">
                <Edit2 className="size-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-slate-400">This name will be visible to your Chatify contacts.</p>
        </div>

        {/* About section */}
        <div className={`p-4 rounded-xl space-y-2 border ${isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider">About Status</p>
          {isEditingAbout ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className={`w-full bg-transparent border-b-2 border-[#06b6d4] py-1 text-base focus:outline-none ${
                  isDark ? "text-slate-100" : "text-gray-900"
                }`}
              />
              <button onClick={handleSaveAbout} className="p-1.5 bg-[#06b6d4] text-slate-950 font-bold rounded-full">
                <Check className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm">{authUser?.about || "Hey there! I am using Chatify"}</span>
              <button onClick={() => setIsEditingAbout(true)} className="text-slate-400 hover:text-[#06b6d4]">
                <Edit2 className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Theme & Sound Toggles */}
        <div className={`p-4 rounded-xl space-y-4 border ${isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider">App Preferences</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="size-5 text-indigo-400" /> : <Sun className="size-5 text-amber-500" />}
              <div>
                <p className="text-sm font-medium">Appearance</p>
                <p className="text-xs text-slate-400">{isDark ? "Chatify Dark Theme" : "Chatify Light Theme"}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors bg-[#06b6d4] text-slate-950 hover:bg-[#0891b2] hover:text-white"
            >
              Switch Theme
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
            <div className="flex items-center gap-3">
              {isSoundEnabled ? <Volume2 className="size-5 text-cyan-400" /> : <VolumeX className="size-5 text-gray-400" />}
              <div>
                <p className="text-sm font-medium">Notification Sounds</p>
                <p className="text-xs text-slate-400">{isSoundEnabled ? "Sound enabled" : "Sound muted"}</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isSoundEnabled ? "bg-[#06b6d4] text-slate-950" : "bg-gray-700 text-white"
              }`}
            >
              {isSoundEnabled ? "Mute" : "Unmute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatifySettingsDrawer;
