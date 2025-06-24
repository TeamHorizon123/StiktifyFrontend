import React, { useRef, useEffect, useState } from "react";

interface MainVideoProps {
  videoUrl: string;
  onVideoWatched?: () => void;
  onVideoDone?: () => void;
}

const MainVideo: React.FC<MainVideoProps> = ({
  videoUrl,
  onVideoWatched,
  onVideoDone,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isAutoNext, setIsAutoNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const percentage =
        (videoElement.currentTime / videoElement.duration) * 100;
      if (percentage >= 5 && videoElement.currentTime >= 10) {
        onVideoWatched?.();
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleEnded = () => {
      onVideoDone?.();
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [onVideoWatched, videoRef.current]); // Cập nhật dependency

  return (
    <div className="w-[73%] bg-transparent shadow-lg absolute left-30 top-[95px] h-3/4 group">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        autoPlay
        muted={false}
        className="w-full h-full"
        loop={!isAutoNext}
      ></video>
      {isAutoNext ? (
        <svg
          onClick={() => setIsAutoNext(false)}
          xmlns="http://www.w3.org/2000/svg"
          style={{ bottom: "min(5vh,45px" }}
          viewBox="0 0 512 512"
          className={`absolute left-[12%] w-[18px] h-[18px] cursor-pointer transition-opacity duration-100 ${
            isPaused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <path
            fill="#ffffff"
            d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"
          />
        </svg>
      ) : (
        <svg
          onClick={() => setIsAutoNext(true)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style={{ bottom: "min(5vh,45px" }}
          className={`absolute left-[12%] w-[18px] h-[18px] cursor-pointer transition-opacity duration-100 ${
            isPaused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <path
            fill="#ffffff"
            d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z"
          />
        </svg>
      )}
    </div>
  );
};

export default MainVideo;
