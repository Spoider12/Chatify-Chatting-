import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic } from "lucide-react";

function AudioPlayer({ src, duration = 0, isOutgoing, isDark }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setTotalDuration(Math.floor(audio.duration));
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 min-w-[220px] max-w-[280px] py-1">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`p-2.5 rounded-full transition-transform active:scale-95 shadow-sm ${
          isOutgoing
            ? "bg-[#06b6d4] text-slate-950 font-bold hover:bg-[#0891b2]"
            : isDark
            ? "bg-slate-700 text-cyan-300 hover:bg-slate-600"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
      </button>

      {/* Audio scrubber & timeline */}
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="range"
          min="0"
          max={totalDuration || 1}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 accent-[#06b6d4] bg-slate-600/40 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] opacity-80">
          <span>{formatTime(isPlaying ? currentTime : totalDuration)}</span>
          <button
            onClick={toggleSpeed}
            className={`px-1.5 py-0.5 rounded font-mono font-bold hover:bg-black/20 text-[10px] ${
              playbackRate > 1 ? "text-[#06b6d4]" : ""
            }`}
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      <Mic className={`size-4 opacity-70 ${isOutgoing ? "text-cyan-200" : "text-slate-400"}`} />
    </div>
  );
}

export default AudioPlayer;
