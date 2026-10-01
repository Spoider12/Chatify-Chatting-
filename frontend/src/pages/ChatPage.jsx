import React, { useEffect } from "react";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ProfileHeader from "../components/ProfileHeader";
import ContactsList from "../components/ContactsList";
import ChatContainer from "../components/ChatContainer";
import GroupTab from "../components/group/GroupTab";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ChatifySearchBar from "../components/ChatifySearchBar";
import ChatifySettingsDrawer from "../components/ChatifySettingsDrawer";
import ChatifyStatusDrawer from "../components/ChatifyStatusDrawer";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
  const {
    activeTab,
    selectedUser,
    selectedGroup,
    activeDrawer,
    setActiveDrawer,
    getMyChatPartners,
    getAllContacts,
    subscribeToMessages,
    unsubscribeFromMessages,
    theme,
  } = useChatStore();

  const isDark = theme === "dark";

  useEffect(() => {
    getMyChatPartners();
    getAllContacts();
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [getMyChatPartners, getAllContacts, subscribeToMessages, unsubscribeFromMessages]);

  const hasSelectedConversation = selectedUser || selectedGroup;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${
      isDark ? "bg-[#070a11]" : "bg-slate-200"
    }`}>
      {/* Top Banner Decorator */}
      {!isDark && <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-600 to-indigo-600 z-0" />}

      {/* Main Chatify Window Container */}
      <div className={`relative z-10 w-full h-full max-w-[1600px] xl:h-[94vh] xl:my-auto xl:rounded-xl shadow-2xl flex overflow-hidden border ${
        isDark ? "bg-[#0b0f19] border-[#1f2937]" : "bg-white border-slate-300"
      }`}>
        {/* LEFT SIDEBAR (Chats, Contacts, Groups, Drawers) */}
        <div
          className={`w-full md:w-[380px] lg:w-[420px] flex flex-col border-r relative ${
            isDark ? "bg-[#0b0f19] border-[#1f2937]" : "bg-white border-slate-200"
          } ${hasSelectedConversation ? "hidden md:flex" : "flex"}`}
        >
          <ProfileHeader />
          <ChatifySearchBar />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto">
            {activeTab === "chats" && <ChatsList />}
            {activeTab === "contacts" && <ContactsList />}
            {activeTab === "groups" && <GroupTab />}
          </div>

          {/* Slide-over Drawers */}
          {activeDrawer === "settings" && (
            <ChatifySettingsDrawer onClose={() => setActiveDrawer(null)} />
          )}

          {activeDrawer === "status" && (
            <ChatifyStatusDrawer onClose={() => setActiveDrawer(null)} />
          )}
        </div>

        {/* RIGHT MAIN CHAT AREA */}
        <div
          className={`flex-1 flex flex-col ${
            !hasSelectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          {hasSelectedConversation ? (
            <ChatContainer />
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;