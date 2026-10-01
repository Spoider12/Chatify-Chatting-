import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import { MessageSquare, UserIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSignUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-cyan-600 to-indigo-600 z-0" />

      <div className="relative z-10 w-full max-w-4xl bg-[#111827] rounded-2xl shadow-2xl overflow-hidden border border-[#1f2937] flex flex-col md:flex-row">
        {/* Form Column Left */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-[#06b6d4] flex items-center justify-center text-slate-950 shadow-lg">
              <MessageSquare className="size-6 fill-current" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-wide">Chatify Chatting</h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-200 mb-1">Create Account</h2>
          <p className="text-sm text-slate-400 mb-8">Join Chatify to connect with friends & groups</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="auth-input-label">Full Name</label>
              <div className="relative">
                <UserIcon className="auth-input-icon text-slate-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-input-label">Email address</label>
              <div className="relative">
                <MailIcon className="auth-input-icon text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] focus:outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-input-label">Password</label>
              <div className="relative">
                <LockIcon className="auth-input-icon text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] focus:outline-none"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSignUp}
              className="w-full py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center mt-2"
            >
              {isSignUp ? <LoaderIcon className="size-5 animate-spin" /> : "Create Chatify Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#06b6d4] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Right Banner */}
        <div className="hidden md:w-1/2 bg-[#0b0f19] p-12 md:flex flex-col items-center justify-center text-center border-l border-[#1f2937]">
          <div className="size-32 rounded-full bg-[#06b6d4]/10 flex items-center justify-center mb-6 border border-[#06b6d4]/30">
            <MessageSquare className="size-16 text-[#06b6d4]" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Fast. Modern. Private.</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Experience real-time messaging, voice notes, emoji reactions, and group chats on Chatify Chatting.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="px-3 py-1 bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-semibold rounded-full">Encrypted</span>
            <span className="px-3 py-1 bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-semibold rounded-full">Group Chats</span>
            <span className="px-3 py-1 bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-semibold rounded-full">Media Sharing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
