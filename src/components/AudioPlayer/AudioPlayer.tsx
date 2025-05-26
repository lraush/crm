import React, { useState, useRef, useEffect } from "react";

interface AudioPlayerStubProps {
  audioUrl: string;
  duration?: string; 
}

const AudioPlayerStub: React.FC<AudioPlayerStubProps> = ({
  audioUrl,
  duration,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        border: "none",
        padding: 10,
        borderRadius: 6,
        maxWidth: 320,
        display: "flex",
        alignItems: "center",
        gap: 12,
        // background: "#f9f9f9",
        userSelect: "none",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {!isCollapsed && (
        <>
          <button
            onClick={togglePlay}
            style={{
              fontSize: 20,
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? "⏸" : "▶️"}
          </button>

          <a
            href={audioUrl}
            download
            aria-label="Скачать аудио"
            title="Скачать аудио"
          >
            "save"
          </a>
        </>
      )}

      <button
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
      >
        {isCollapsed ? `${duration}` : "X"}
      </button>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default AudioPlayerStub;
