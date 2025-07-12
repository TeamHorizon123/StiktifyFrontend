import React, { useRef, useEffect, useState } from "react";

interface MainVideoProps {
  videoUrl: string;
  onVideoWatched?: () => void;
  onVideoDone?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const MainVideo: React.FC<MainVideoProps> = ({
  videoUrl,
  onVideoWatched,
  onVideoDone,
  onPlay,
  onPause,
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

    const handlePlay = () => {
      setIsPaused(false);
      onPlay?.();
    };
    const handlePause = () => {
      setIsPaused(true);
      onPause?.();
    };
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
  }, [onVideoWatched, onPlay, onPause, onVideoDone]);

  return (
    // <div className="w-[80%] bg-[#18182c] shadow-lg absolute left-35 top-[40px] h-[100%] group">
    <div className="w-[96%] main-layout shadow-lg absolute left-[6%] h-[90%] group">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          muted={false}
          className="w-full h-full"
          loop={!isAutoNext}
        ></video>

        <div
          className={`absolute bottom-8 left-[17%] transition-opacity duration-200 ${
            isPaused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={() => setIsAutoNext((prev) => !prev)}
            title={isAutoNext ? "Autoplay is on" : "Autoplay is off"}
            className={`flex items-center px-2 py-1 rounded-full transition ml-2`}
            style={{ minWidth: 48 }}
          >
            <span
              className={`inline-block w-8 h-5 rounded-full transition-all duration-200 ${
                isAutoNext ? "bg-purple-500" : "bg-gray-400"
              }`}
              style={{ position: "relative" }}
            >
              <span
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 ${
                  isAutoNext ? "translate-x-4" : "translate-x-0"
                } transition-all duration-100 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow`}
              >
                {isAutoNext ? (
                  // Play icon
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="purple"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="purple" />
                  </svg>
                ) : (
                  // Pause icon
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gray"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16" fill="gray" />
                    <rect x="14" y="4" width="4" height="16" fill="gray" />
                  </svg>
                )}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainVideo;
