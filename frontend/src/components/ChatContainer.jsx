import React, { useEffect, useRef, useState } from "react";
import { CheckCheck } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import AudioPlayer from "./AudioPlayer";
import MessageReactionMenu from "./MessageReactionMenu";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    reactToMessage,
    deleteMessage,
    setReplyToMessage,
    theme,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const isDark = theme === "dark";

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  const formatMessageTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <ChatHeader />

      {/* Image Modal Preview */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <img src={selectedImageModal} alt="Expanded" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain" />
        </div>
      )}

      {/* Messages Canvas Area */}
      <div className={`flex-1 overflow-y-auto px-4 py-6 ${isDark ? "chatify-chat-bg-dark" : "chatify-chat-bg-light"}`}>
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.senderId === authUser._id;
              const isMenuOpen = activeMenuMessageId === msg._id;

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isOwn ? "items-end" : "items-start"} group relative`}
                >
                  {/* Reaction Toolbar Menu */}
                  {isMenuOpen && (
                    <div className={`absolute -top-10 ${isOwn ? "right-2" : "left-2"} z-30`}>
                      <MessageReactionMenu
                        message={msg}
                        isOwnMessage={isOwn}
                        isDark={isDark}
                        onReact={(emoji) => {
                          reactToMessage(msg._id, emoji);
                          setActiveMenuMessageId(null);
                        }}
                        onReply={() => {
                          setReplyToMessage(msg);
                          setActiveMenuMessageId(null);
                        }}
                        onDelete={() => {
                          deleteMessage(msg._id);
                          setActiveMenuMessageId(null);
                        }}
                      />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    onMouseEnter={() => setActiveMenuMessageId(msg._id)}
                    onMouseLeave={() => setActiveMenuMessageId(null)}
                    className={`relative max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl shadow-md text-sm ${
                      isOwn
                        ? isDark
                          ? "bg-[#0891b2] text-white rounded-tr-none"
                          : "bg-[#e0f2fe] text-slate-900 rounded-tr-none border border-cyan-200"
                        : isDark
                        ? "bg-[#1f2937] text-slate-100 rounded-tl-none border border-slate-700/50"
                        : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    {/* Quoted Reply Display inside Bubble */}
                    {msg.replyTo && (
                      <div className={`mb-2 p-2 rounded-lg border-l-4 border-[#06b6d4] text-xs ${
                        isDark ? "bg-black/25" : "bg-black/5"
                      }`}>
                        <p className="font-semibold text-[#06b6d4]">{msg.replyTo.senderName}</p>
                        <p className="opacity-80 truncate">{msg.replyTo.text}</p>
                      </div>
                    )}

                    {/* Image Payload */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Sent media"
                        onClick={() => setSelectedImageModal(msg.image)}
                        className="rounded-xl max-h-72 w-full object-cover mb-1.5 cursor-pointer hover:opacity-95 transition-opacity"
                      />
                    )}

                    {/* Audio Payload */}
                    {msg.audio && (
                      <AudioPlayer
                        src={msg.audio}
                        duration={msg.audioDuration}
                        isOutgoing={isOwn}
                        isDark={isDark}
                      />
                    )}

                    {/* Text Payload */}
                    {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}

                    {/* Footer: Time + Ticks */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                      <span>{formatMessageTime(msg.createdAt)}</span>
                      {isOwn && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="size-3.5 text-[#22d3ee]" />
                          ) : (
                            <CheckCheck className="size-3.5 opacity-70" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Reactions Display Pills below bubble */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`absolute -bottom-3 ${
                          isOwn ? "left-2" : "right-2"
                        } flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border shadow-md text-xs ${
                          isDark ? "bg-[#1f2937] border-[#374151]" : "bg-white border-slate-200"
                        }`}
                      >
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r.emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;