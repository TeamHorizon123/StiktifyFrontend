"use client";
import { useGlobalContext } from "@/library/global.context";
import React, { useEffect, useState, useRef } from "react";
import MusicPlayerKaraoke from "./music.howler";
import Image from "next/image";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

interface Lyric {
  end: number;
  start: number;
  text: string;
}

const Karaoke = () => {
  const { trackKaraoke } = useGlobalContext()!;
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyrics = (trackKaraoke?.musicLyric as Lyric[]) || [];
  const router = useRouter();

  // Tìm lyric hiện tại dựa trên thời gian
  useEffect(() => {
    if (!lyrics.length) return;

    let foundIndex = -1;

    // Tìm lyric đang phát
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].start && currentTime <= lyrics[i].end) {
        foundIndex = i;
        break;
      }
    }

    // Nếu không tìm thấy, tìm lyric tiếp theo
    if (foundIndex === -1) {
      for (let i = 0; i < lyrics.length; i++) {
        if (currentTime < lyrics[i].start) {
          foundIndex = Math.max(0, i - 1);
          break;
        }
      }
      // Nếu đã qua tất cả, chọn lyric cuối
      if (foundIndex === -1) {
        foundIndex = lyrics.length - 1;
      }
    }

    setCurrentLyricIndex(foundIndex);
  }, [currentTime, lyrics]);

  // Scroll đến lyric hiện tại
  useEffect(() => {
    if (currentLyricIndex === -1 || !lyricsContainerRef.current) return;

    const activeLyric = document.getElementById(`lyric-${currentLyricIndex}`);
    if (!activeLyric) return;

    const container = lyricsContainerRef.current;
    const lyricTop = activeLyric.offsetTop;
    const containerHeight = container.clientHeight;
    const lyricHeight = activeLyric.clientHeight;

    container.scrollTo({
      top: lyricTop - containerHeight / 2 + lyricHeight / 2,
      behavior: "smooth",
    });
  }, [currentLyricIndex]);

  return (
    <div className="grid grid-cols-2 w-full h-full p-4 bg-black text-white rounded-lg items-center">
      <div
        onClick={() => router.back()}
        className="absolute left-34 top-3 bg-white  rounded-full hover:bg-gray-700 cursor-pointer"
      >
        <IoMdArrowRoundBack color="black" className="m-2" size={20} />
      </div>
      <div className="flex justify-center flex-col items-center">
        {trackKaraoke?.musicThumbnail && (
          <Image
            className="rounded-lg mb-4"
            src={trackKaraoke.musicThumbnail}
            alt="thumbnail"
            width={400}
            height={400}
            priority
          />
        )}
        <span className="text-4xl font-semibold mb-8 text-center max-w-[400px] truncate">
          {trackKaraoke?.musicDescription || "No title"}
        </span>

        <MusicPlayerKaraoke
          setSeekProps={setCurrentTime}
          isPlayingProp={isPlaying}
          setIsPlayingProp={setIsPlaying}
        />
      </div>

      <div
        ref={lyricsContainerRef}
        className="overflow-y-auto h-[96vh] flex flex-col items-start p-4 scroll-smooth"
      >
        {lyrics.map((lyric, index) => (
          <p
            key={index}
            id={`lyric-${index}`}
            className={`my-2 transition-all duration-300 ${
              index === currentLyricIndex
                ? "text-purple-400 font-bold text-4xl"
                : "text-gray-400 text-3xl"
            }`}
          >
            {lyric.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Karaoke;
