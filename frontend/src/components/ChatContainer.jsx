import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader />

      {/* Messages Area (ONLY this scrolls) */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative max-w-xs ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {/* Image */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="rounded-lg max-h-60 object-cover"
                    />
                  )}

                  {/* Text */}
                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  {/* Time */}
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {new Date(msg.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Message Input (ALWAYS visible) */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
