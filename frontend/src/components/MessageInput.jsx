import React, { useRef, useState, useEffect } from "react";
import { Smile, Paperclip, Mic, Send, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";
import EmojiPickerPopover from "./EmojiPickerPopover";
import VoiceRecorder from "./VoiceRecorder";
import toast from "react-hot-toast";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    sendMessage,
    isSoundEnabled,
    sendTypingSignal,
    replyToMessage,
    setReplyToMessage,
    theme,
  } = useChatStore();

  const isDark = theme === "dark";

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendTypingSignal(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingSignal(false);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendTypingSignal(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendVoiceNote = (audioDataUri, durationInSeconds) => {
    sendMessage({
      text: "",
      audio: audioDataUri,
      audioDuration: durationInSeconds,
    });
    setIsVoiceRecording(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`relative px-4 py-3 border-t ${
      isDark ? "bg-[#111827] border-[#1f2937]" : "bg-slate-100 border-slate-200"
    }`}>
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <EmojiPickerPopover
          onSelectEmoji={(emoji) => setText((prev) => prev + emoji)}
          onClose={() => setShowEmojiPicker(false)}
          isDark={isDark}
        />
      )}

      {/* Quoted Reply Preview */}
      {replyToMessage && (
        <div className={`mb-2 p-2.5 rounded-lg border-l-4 border-[#06b6d4] flex items-center justify-between animate-in slide-in-from-bottom-1 ${
          isDark ? "bg-[#0b0f19]" : "bg-white"
        }`}>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#06b6d4]">
              Replying to {replyToMessage.senderName || "Message"}
            </p>
            <p className={`text-xs truncate ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              {replyToMessage.text || (replyToMessage.audio ? "🎤 Voice message" : "📷 Photo")}
            </p>
          </div>
          <button onClick={() => setReplyToMessage(null)} className="p-1 text-slate-400 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Image Preview Box */}
      {imagePreview && (
        <div className="mb-2 inline-block relative">
          <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-[#06b6d4]" />
          <button
            onClick={() => {
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recorder View or Standard Input Form */}
      {isVoiceRecording ? (
        <VoiceRecorder
          onSendVoice={handleSendVoiceNote}
          onCancel={() => setIsVoiceRecording(false)}
          isDark={isDark}
        />
      ) : (
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Emoji Toggle Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              showEmojiPicker ? "text-[#06b6d4]" : "text-slate-400"
            }`}
            title="Emojis"
          >
            <Smile className="size-6" />
          </button>

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              imagePreview ? "text-[#06b6d4]" : "text-slate-400"
            }`}
            title="Attach image"
          >
            <Paperclip className="size-6" />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type a message"
            value={text}
            onChange={handleInputChange}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors ${
              isDark
                ? "bg-[#1f2937] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4]"
                : "bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-[#06b6d4]"
            }`}
          />

          {/* Send OR Mic Button */}
          {text.trim() || imagePreview ? (
            <button
              type="submit"
              className="p-2.5 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 font-bold rounded-full shadow-md transition-colors"
              title="Send message"
            >
              <Send className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsVoiceRecording(true)}
              className="p-2.5 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 font-bold rounded-full shadow-md transition-colors"
              title="Record voice message"
            >
              <Mic className="size-5" />
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default MessageInput;