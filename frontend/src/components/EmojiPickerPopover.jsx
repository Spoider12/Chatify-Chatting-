import React, { useState } from "react";
import { Search, X } from "lucide-react";

const EMOJI_CATEGORIES = [
  {
    name: "Frequently Used",
    emojis: ["😂", "❤️", "👍", "🙏", "😍", "😊", "🔥", "😭", "✨", "🤣", "🙌", "💀", "🎉", "⚡", "💯"],
  },
  {
    name: "Smileys & People",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗",
      "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒",
      "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵",
      "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰",
      "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀",
    ],
  },
  {
    name: "Gestures & Hands",
    emojis: [
      "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚",
      "🖐️", "✋", "🖖", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦶",
    ],
  },
  {
    name: "Hearts & Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝",
      "🔥", "💥", "✨", "🌟", "💫", "⚡", "💯", "✅", "❌", "❓", "❗", "⭕", "🛑",
    ],
  },
];

function EmojiPickerPopover({ onSelectEmoji, onClose, isDark }) {
  const [filter, setFilter] = useState("");

  return (
    <div
      className={`absolute bottom-14 left-2 z-50 w-80 h-96 rounded-xl shadow-2xl flex flex-col border overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${
        isDark ? "bg-[#202c33] border-[#222d34] text-slate-200" : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className={`p-2.5 flex items-center justify-between border-b ${isDark ? "border-[#222d34]" : "border-gray-200"}`}>
        <div className={`flex items-center gap-2 flex-1 px-2.5 py-1 rounded-lg ${isDark ? "bg-[#111b21]" : "bg-gray-100"}`}>
          <Search className="size-4 text-[#8696a0]" />
          <input
            type="text"
            placeholder="Search emoji"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>
        <button onClick={onClose} className="p-1 text-[#8696a0] hover:text-white ml-2">
          <X className="size-4" />
        </button>
      </div>

      {/* Emoji List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {EMOJI_CATEGORIES.map((cat) => {
          const filteredEmojis = filter
            ? cat.emojis.filter((e) => e.includes(filter))
            : cat.emojis;

          if (filteredEmojis.length === 0) return null;

          return (
            <div key={cat.name}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-[#8696a0]" : "text-gray-500"}`}>
                {cat.name}
              </p>
              <div className="grid grid-cols-7 gap-1">
                {filteredEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectEmoji(emoji);
                    }}
                    className="size-8 text-xl flex items-center justify-center rounded hover:bg-white/10 transition-transform active:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmojiPickerPopover;
