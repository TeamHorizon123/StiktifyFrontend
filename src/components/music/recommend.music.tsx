"use client";
import { useGlobalContext } from "@/library/global.context";
import CardMusic from "./card.music";
import { useRef, useState } from "react";

interface IProps {
  data: IMusic[];
}

const RecommendMusicList = (props: IProps) => {
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {data &&
        data.length > 0 &&
        data.map((item) => (
          <div key={item._id} className="flex-shrink-0 w-48">
            <CardMusic
              handlePlayer={handlePlayer}
              isPlaying={isPlaying}
              item={item}
            />
          </div>
        ))}
    </div>
  );
};

export default RecommendMusicList;
