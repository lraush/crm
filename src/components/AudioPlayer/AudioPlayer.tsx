// import React, { useState, useRef, useEffect } from "react";
// import "./AudioPlayer.css";

// interface AudioPlayerStubProps {
//   audioUrl: string;
//   duration?: string;
// }

// const AudioPlayerStub: React.FC<AudioPlayerStubProps> = ({
//   audioUrl,
//   duration,
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [durationTime, setDurationTime] = useState(0);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const onLoadedMetadata = () => {
//       setDurationTime(audio.duration);
//     };

//     const onTimeUpdate = () => setCurrentTime(audio.currentTime);
//     const onEnded = () => setIsPlaying(false);

//     audio.addEventListener("loadedmetadata", onLoadedMetadata);
//     audio.addEventListener("timeupdate", onTimeUpdate);
//     audio.addEventListener("ended", onEnded);

//     return () => {
//       audio.removeEventListener("loadedmetadata", onLoadedMetadata);
//       audio.removeEventListener("timeupdate", onTimeUpdate);
//       audio.removeEventListener("ended", onEnded);
//     };
//   }, []);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     isPlaying ? audioRef.current.pause() : audioRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!audioRef.current) return;
//     const value = Number(e.target.value);
//     audioRef.current.currentTime = value;
//     setCurrentTime(value);
//   };

//   return (
//     <div className="audio-player">
//       {!isCollapsed && (
//         <>
//           <button
//             className="audio-player__button"
//             onClick={togglePlay}
//             aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
//           >
//             {isPlaying ? "⏸" : "▶️"}
//           </button>

//           <div className="audio-player__time">{formatTime(currentTime)}</div>

//           <input
//             type="range"
//             className="audio-player__slider"
//             min="0"
//             max={durationTime}
//             value={currentTime}
//             onChange={handleSliderChange}
//           />

//           <a
//             className="audio-player__download"
//             href={audioUrl}
//             download
//             aria-label="Скачать аудио"
//             title="Скачать аудио"
//           >
//             save
//           </a>
//         </>
//       )}

//       <button
//         className="audio-player__toggle"
//         onClick={toggleCollapse}
//         aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
//       >
//         {isCollapsed ? (duration ?? "00:00") : "✕"}
//       </button>

//       <audio ref={audioRef} src={audioUrl} preload="metadata" />
//     </div>
//   );
// };

// export default AudioPlayerStub;
