"use client";
import { useGlobalContext } from "@/library/global.context";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

interface IProps {
  data: IMusic[];
}

const RecentlyPlayedList = (props: IProps) => {
  const { data } = props;
  const {
    setTrackCurrent,
    trackCurrent,
    isPlaying,
    setIsPlaying,
    setListPlayList,
    setFlag,
  } = useGlobalContext()!;

  // Thêm state để lưu durations
  const [durations, setDurations] = useState<{ [key: string]: string }>({});

  // Function để get duration từ audio URL
  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      });
      audio.addEventListener("error", () => {
        reject("Error loading audio");
      });
    });
  };

  // Load durations khi component mount hoặc data thay đổi
  useEffect(() => {
    data.forEach((item) => {
      if (item.musicUrl && !durations[item.musicUrl]) {
        getDuration(item.musicUrl)
          .then((duration) => {
            setDurations((prev) => ({
              ...prev,
              [item.musicUrl!]: duration,
            }));
          })
          .catch(() => {
            setDurations((prev) => ({
              ...prev,
              [item.musicUrl!]: "--:--",
            }));
          });
      }
    });
  }, [data]);

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      setFlag(false);
      setTrackCurrent(track);
      setListPlayList(data);
      localStorage.setItem("trackCurrent", JSON.stringify(track));
      return setIsPlaying(true);
    }
    return setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-2">
      {data.slice(0, 5).map((item, index) => (
        <div
          key={`${item._id}-${index}`}
          className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
          onClick={() => handlePlayer(item)}
        >
          {/* Track Number */}
          <div className="w-8 text-center">
            {trackCurrent?._id === item._id && isPlaying ? (
              <div className="flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-purple-500 animate-pulse"></div>
                  <div
                    className="w-1 h-4 bg-purple-500 animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-purple-500 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <span className="text-gray-400">{index + 1}</span>
            )}
          </div>

          {/* Album Art */}
          <div className="relative w-12 h-12 rounded-md overflow-hidden">
            <Image
              src={item.musicThumbnail}
              alt={item.musicDescription}
              fill
              className="object-cover"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div
              className={`font-medium truncate ${trackCurrent?._id === item._id
                ? "text-purple-500"
                : "text-white"
                }`}
            >
              {item.musicDescription}
            </div>
            <div className="text-gray-400 text-sm truncate">
              {item.userId?.fullname || "Unknown Artist"}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-gray-400 text-sm">
            {/* <span>{item.totalListener?.toLocaleString() || 0}</span> */}
            {/* Duration */}
            <span>{durations[item.musicUrl!] || "--:--"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyPlayedList;
