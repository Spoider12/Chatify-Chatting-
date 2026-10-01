import React from "react";
import { Reply, Trash2 } from "lucide-react";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function MessageReactionMenu({ message, onReact, onReply, onDelete, isOwnMessage, isDark }) {
  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-full shadow-2xl border backdrop-blur-md animate-in zoom-in-95 duration-150 ${
        isDark ? "bg-[#202c33]/95 border-[#2a3942]" : "bg-white/95 border-gray-200"
      }`}
    >
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="size-7 text-lg flex items-center justify-center rounded-full hover:bg-white/20 transition-transform active:scale-125 hover:scale-110"
        >
          {emoji}
        </button>
      ))}

      <div className={`h-4 w-[1px] mx-1 ${isDark ? "bg-slate-700" : "bg-gray-300"}`} />

      <button
        onClick={onReply}
        className="p-1.5 rounded-full hover:bg-white/20 text-[#8696a0] hover:text-white transition-colors"
        title="Reply"
      >
        <Reply className="size-4" />
      </button>

      {isOwnMessage && !message.isDeleted && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400 transition-colors ml-0.5"
          title="Delete message"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

export default MessageReactionMenu;
