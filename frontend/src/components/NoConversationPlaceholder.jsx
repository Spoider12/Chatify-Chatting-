import React from "react";
import { Lock, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoConversationPlaceholder() {
  const { theme } = useChatStore();
  const isDark = theme === "dark";

  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 text-center border-l ${
      isDark ? "bg-[#0b0f19] border-[#1f2937] text-slate-200" : "bg-slate-100 border-slate-200 text-gray-800"
    }`}>
      <div className="max-w-md space-y-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        {/* Chatify Branding Icon */}
        <div className="size-24 rounded-full bg-gradient-to-tr from-[#06b6d4]/20 to-[#6366f1]/20 flex items-center justify-center shadow-lg border border-[#06b6d4]/30">
          <MessageSquare className="size-12 text-[#06b6d4]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Chatify Chatting
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Send real-time messages, record voice notes, share photos, and chat in groups with your contacts.
          </p>
        </div>

        <div className="pt-6 flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06b6d4]/10 text-cyan-400 font-semibold border border-cyan-500/20">
            <Zap className="size-3.5" />
            <span>Instant Sync</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06b6d4]/10 text-cyan-400 font-semibold border border-cyan-500/20">
            <ShieldCheck className="size-3.5" />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoConversationPlaceholder;
