"use client";

import type React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture2,
  Loader,
} from "lucide-react";
import { Switch } from "antd";

interface MainVideoProps {
  videoUrl: string;
  onVideoWatched?: () => void;
  onVideoDone?: () => void;
  onScrollNext?: () => void;
  onScrollPrev?: () => void;
}

const MainVideo: React.FC<MainVideoProps> = ({
  videoUrl,
  onVideoWatched,
  onVideoDone,
  onScrollNext,
  onScrollPrev,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isAutoNext, setIsAutoNext] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<
    "portrait" | "landscape" | "square"
  >("portrait");
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (videoRef.current && Array.isArray(value) && value.length > 0) {
      const newVolume = Math.max(0, Math.min(100, value[0]));
      const normalizedVolume = newVolume / 100;

      if (isFinite(normalizedVolume) && !isNaN(normalizedVolume)) {
        videoRef.current.volume = normalizedVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
      }
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;

      if (isFinite(current) && isFinite(total)) {
        setCurrentTime(current);

        // Update buffered time
        if (videoRef.current.buffered.length > 0) {
          const buffered = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1
          );
          setBufferedTime(buffered);
        }

        const percentage = (current / total) * 100;
        if (percentage >= 5 && current >= 10) {
          onVideoWatched?.();
        }
      }
    }
  }, [onVideoWatched]);

  const handleProgressChange = useCallback(
    (value: number[]) => {
      if (
        videoRef.current &&
        duration > 0 &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        const newTime = (value[0] / 100) * duration;
        if (
          isFinite(newTime) &&
          !isNaN(newTime) &&
          newTime >= 0 &&
          newTime <= duration
        ) {
          videoRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      }
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message} (${err.name})`
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  }, []);

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle wheel scroll for video navigation
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // Check if scrolling on controls area - if so, allow normal behavior
      const target = e.target as HTMLElement;
      if (target.closest(".video-controls")) {
        return;
      }

      // Navigate videos based on scroll direction
      if (e.deltaY > 0) {
        // Scroll down - next video
        onScrollNext?.();
      } else {
        // Scroll up - previous video
        onScrollPrev?.();
      }
    },
    [onScrollNext, onScrollPrev]
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleLoadedMetadata = () => {
      if (isFinite(videoElement.duration)) {
        setDuration(videoElement.duration);
      }
      const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      if (aspectRatio < 0.8) {
        setVideoAspectRatio("portrait");
      } else if (aspectRatio > 1.2) {
        setVideoAspectRatio("landscape");
      } else {
        setVideoAspectRatio("square");
      }
      setIsLoading(false);
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleEndedEvent = () => {
      setIsPlaying(false);
      onVideoDone?.();
    };
    const handleVolumeChangeEvent = () => {
      const vol = videoElement.volume * 100;
      if (isFinite(vol)) {
        setVolume(vol);
      }
      setIsMuted(videoElement.muted || videoElement.volume === 0);
    };
    const handleFullscreenChangeEvent = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Add all event listeners
    videoElement.addEventListener("loadstart", handleLoadStart);
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("playing", handlePlaying);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlayEvent);
    videoElement.addEventListener("pause", handlePauseEvent);
    videoElement.addEventListener("ended", handleEndedEvent);
    videoElement.addEventListener("volumechange", handleVolumeChangeEvent);
    document.addEventListener("fullscreenchange", handleFullscreenChangeEvent);

    // Initial state sync
    setIsPlaying(!videoElement.paused);
    setIsMuted(videoElement.muted);
    const initialVolume = videoElement.volume * 100;
    if (isFinite(initialVolume)) {
      setVolume(initialVolume);
    }

    return () => {
      videoElement.removeEventListener("loadstart", handleLoadStart);
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("playing", handlePlaying);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlayEvent);
      videoElement.removeEventListener("pause", handlePauseEvent);
      videoElement.removeEventListener("ended", handleEndedEvent);
      videoElement.removeEventListener("volumechange", handleVolumeChangeEvent);
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChangeEvent
      );
    };
  }, [handleTimeUpdate, onVideoDone]);

  // Keyboard controls for play/pause and mute
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (!videoRef.current) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayPause();
      } else if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        toggleMute();
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (duration > 0) {
          const newTime = Math.min(duration, videoRef.current.currentTime + 5);
          videoRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const newTime = Math.max(0, videoRef.current.currentTime - 5);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onScrollPrev?.();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        onScrollNext?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlayPause,
    toggleMute,
    toggleFullscreen,
    duration,
    onScrollNext,
    onScrollPrev,
  ]);

  const getVideoContainerClasses = () => {
    if (isFullscreen) {
      return "w-full h-full";
    }
    switch (videoAspectRatio) {
      case "portrait":
        return "w-[460px] h-[700px]";
      case "landscape":
        return "w-[830px] h-[515px]";
      case "square":
        return "w-[600px] h-[600px]";
      default:
        return "w-[460px] h-[700px]";
    }
  };

  const getVideoClasses = () => {
    const baseClasses = "transition-all duration-300 rounded-lg";
    if (isFullscreen) {
      return `${baseClasses} w-full h-full object-contain`;
    }
    return `${baseClasses} w-full h-full object-cover`;
  };

  const togglePictureInPicture = useCallback(() => {
    const video = videoRef.current;

    if (video && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        if (video.readyState >= 1) {
          video
            .requestPictureInPicture()
            .catch((err) => console.error("PiP error:", err));
        } else {
          const onMetadataLoaded = () => {
            video
              .requestPictureInPicture()
              .catch((err) => console.error("PiP error:", err));
            video.removeEventListener("loadedmetadata", onMetadataLoaded);
          };
          video.addEventListener("loadedmetadata", onMetadataLoaded);
        }
      }
    }
  }, []);

  const handleVideoClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".video-controls")) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      togglePlayPause();
    },
    [togglePlayPause]
  );

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (bufferedTime / duration) * 100 : 0;

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 left-[15%] w-full max-w-[1000px] mx-auto"
      onWheel={handleWheel} // Thêm wheel handler ở container level
    >
      <div
        className={`relative ${getVideoContainerClasses()} group shadow-2xl rounded-lg overflow-hidden bg-black`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted={true}
          className={getVideoClasses()}
          loop={!isAutoNext}
          onClick={handleVideoClick}
          playsInline
          preload="metadata"
        />

        {/* Loading Overlay */}
        {(isLoading || isBuffering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && !isLoading && !isBuffering && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-10"
            onClick={togglePlayPause}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Video Controls Bar */}
        <div
          className={`video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8 transition-opacity duration-300 z-20 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar with Buffered */}
          <div className="w-full mb-4 relative h-2 flex items-center">
            {/* Background rail */}
            <div className="absolute w-full h-1 bg-white/30 rounded-full" />

            {/* Buffered progress */}
            <div
              className="absolute h-1 bg-white/50 rounded-full transition-all duration-300"
              style={{ width: `${bufferedProgress}%` }}
            />

            {/* Current progress with custom slider */}
            <div className="relative w-full h-2">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={currentProgress}
                onChange={(e) =>
                  handleProgressChange([parseFloat(e.target.value)])
                }
                className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
              />

              {/* Progress track */}
              <div className="absolute w-full h-1 rounded-full overflow-hidden top-[25%]">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              {/* Progress handle */}
              <div
                className="absolute w-3 h-3 bg-purple-500 rounded-full shadow-lg -mt-0.5 transition-all duration-300"
                style={{ left: `calc(${currentProgress}% - 6px)` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                {/* Volume slider */}
                <div className="w-24 relative h-2 flex items-center">
                  <div className="absolute w-full h-1 bg-white/30 rounded-full" />

                  <div className="relative w-full h-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={volume}
                      onChange={(e) =>
                        handleVolumeChange([parseFloat(e.target.value)])
                      }
                      className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                    />

                    <div className="absolute w-full h-1 rounded-full overflow-hidden top-[25%]">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${volume}%` }}
                      />
                    </div>

                    <div
                      className="absolute w-2 h-2 bg-purple-500 rounded-full shadow-lg -mt-0.5 transition-all duration-300 top-[20%]"
                      style={{ left: `calc(${volume}% - 4px)` }}
                    />
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Auto-play</span>
                <Switch
                  checked={isAutoNext}
                  onChange={setIsAutoNext}
                  size="small"
                  style={{
                    backgroundColor: isAutoNext ? "#a855f7" : undefined,
                  }}
                />
              </div>

              <button
                onClick={togglePictureInPicture}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <PictureInPicture2 className="h-5 w-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainVideo;
