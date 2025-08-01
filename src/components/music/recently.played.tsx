"use client";
import { useGlobalContext } from "@/library/global.context";
import { useRef, useState } from "react";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
            {trackCurrent?._id !== item._id && (
              <Play
                className="w-5 h-5 text-white hidden group-hover:block"
                fill="currentColor"
              />
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
              className={`font-medium truncate ${
                trackCurrent?._id === item._id
                  ? "text-purple-500"
                  : "text-white"
              }`}
            >
              {item.musicDescription}
            </div>
            <div className="text-gray-400 text-sm truncate">
              {item.musicTag?.map((tag) => tag.fullname).join(", ") ||
                "Unknown Artist"}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-gray-400 text-sm">
            <span>{item.totalListener?.toLocaleString() || 0}</span>
            <span>3:21</span>{" "}
            {/* Duration - bạn có thể thêm field duration vào IMusic */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyPlayedList;
