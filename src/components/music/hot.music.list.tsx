"use client";
import { useGlobalContext } from "@/library/global.context";
import CardMusic from "./card.music";
import { useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
interface IProps {
  data: IMusic[];
}
const HotMusicList = (props: IProps) => {
  const { data } = props;
  const {
    setTrackCurrent,
    trackCurrent,
    isPlaying,
    setIsPlaying,
    setListPlayList,
    setFlag,
  } = useGlobalContext()!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      setFlag(false);
      setTrackCurrent(track);
      setListPlayList(data);
      localStorage.setItem("trackCurrent", JSON.stringify(track));
      return setIsPlaying(isPlaying ? true : !isPlaying);
    }
    return setIsPlaying(!isPlaying);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220 * 5, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220 * 5, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Nút điều hướng */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-600"
      >
        <IoIosArrowBack size={24} />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-600"
      >
        <IoIosArrowForward size={24} />
      </button>

      {/* Card List */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hidden scroll-smooth px-8"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {data.map((item) => (
          <div
            key={item._id}
            className="flex-none w-[200px] scroll-snap-align-start"
          >
            <CardMusic
              handlePlayer={handlePlayer}
              isPlaying={isPlaying}
              item={item}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotMusicList;
