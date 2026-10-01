import React, { useState, useEffect, useRef } from "react";
import { Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";

function VoiceRecorder({ onSendVoice, onCancel, isDark }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    startRecording();
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      toast.error("Microphone access denied or unavailable");
      onCancel();
    }
  };

  const stopRecordingCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCancel = () => {
    stopRecordingCleanup();
    onCancel();
  };

  const handleSend = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      return;
    }

    const recordedSeconds = seconds;
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        onSendVoice(base64Audio, recordedSeconds);
      };
      stopRecordingCleanup();
    };

    mediaRecorderRef.current.stop();
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg ${isDark ? "bg-[#1f2937]" : "bg-slate-100"}`}>
      <button onClick={handleCancel} className="text-red-500 hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition-colors" title="Discard voice message">
        <Trash2 className="size-5" />
      </button>

      <div className="flex items-center gap-2 flex-1">
        <div className="size-3 rounded-full bg-cyan-400 animate-ping" />
        <span className={`font-mono text-sm font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>
          {formatTimer(seconds)}
        </span>
        <div className="flex items-center gap-1 ml-3 flex-1 h-3 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-cyan-400/80 rounded-full animate-pulse"
              style={{
                height: `${Math.max(20, Math.floor(Math.sin(i + seconds * 2) * 100))}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSend}
        className="p-2 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 font-bold rounded-full shadow-md transition-colors"
        title="Send voice message"
      >
        <Send className="size-5" />
      </button>
    </div>
  );
}

export default VoiceRecorder;
