"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/library/global.context";
import { MdFavoriteBorder } from "react-icons/md";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { capitalizeWords, formatDateTimeVn, formatNumber } from "@/utils/utils";
import { IoIosMusicalNotes } from "react-icons/io";
import ButtonPlayer from "./button.player";
import { Tooltip } from "antd";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg";
import WaveAnimation from "../wave/wave.animation";
import { useState, useEffect } from "react";

interface IProps {
  item: IMusicInPlaylist[] | [];
  playlist: IPlaylist;
}

const DisplayPlaylistDetail = (props: IProps) => {
  const {
    setTrackCurrent,
    trackCurrent,
    isPlaying,
    setIsPlaying,
    listPlaylist,
    setListPlayList,
  } = useGlobalContext()!;
  const router = useRouter();
  const { item, playlist } = props;
  const [dominantColor, setDominantColor] = useState("#1f2937");

  // Function để extract dominant color từ image
  const extractDominantColor = (imageSrc: string) => {
    const img =
      typeof window !== "undefined"
        ? new window.Image()
        : ({} as HTMLImageElement);
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      try {
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData?.data;

        if (data) {
          let r = 0,
            g = 0,
            b = 0;
          let pixelCount = 0;

          // Sample pixels (every 10th pixel for performance)
          for (let i = 0; i < data.length; i += 40) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            pixelCount++;
          }

          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          // Darken the color a bit for better contrast
          r = Math.floor(r * 0.6);
          g = Math.floor(g * 0.6);
          b = Math.floor(b * 0.6);

          setDominantColor(`rgb(${r}, ${g}, ${b})`);
        }
      } catch (error) {
        console.log("Could not extract color, using default");
        setDominantColor("#1f2937");
      }
    };

    img.onerror = () => {
      setDominantColor("#1f2937");
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    const imageSource =
      playlist && playlist.image !== "" ? playlist.image : noImagePlaylist.src;

    extractDominantColor(imageSource);
  }, [playlist?.image]);

  const handleNavigate = () => {
    router.back();
  };

  const handlePlayer = (trackList: IMusicInPlaylist[]) => {
    if (trackList && trackList.length > 0) {
      setListPlayList(trackList);
      return setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="h-[40vh] w-full relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${dominantColor} 0%, rgba(31, 41, 55, 0.9) 50%, rgba(17, 24, 39, 1) 100%)`,
      }}
    >
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8">
        <div className="flex w-full justify-between items-end">
          <div className="flex gap-6 items-center">
            {/* Playlist Image */}
            <div className="relative">
              <Image
                alt="thumbnail"
                src={
                  playlist && playlist.image !== ""
                    ? playlist.image
                    : noImagePlaylist
                }
                width={200}
                height={200}
                className="rounded-xl shadow-2xl border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>

            {/* Playlist Info */}
            <div className="flex flex-col gap-4">
              <div className="text-sm text-white/80 font-medium uppercase tracking-wide">
                Playlist
              </div>
              <h1 className="text-white text-6xl font-bold leading-tight drop-shadow-lg">
                {playlist?.name}
              </h1>

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2 items-center">
                    <IoIosMusicalNotes size={18} className="text-white/70" />
                    <span className="text-white/90 font-medium">
                      {item.length} {item.length === 1 ? "song" : "songs"}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex gap-2 items-center">
                    <HiOutlineCalendarDateRange
                      size={18}
                      className="text-white/70"
                    />
                    <span className="text-white/90 font-medium">
                      {formatDateTimeVn(playlist?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="mb-4">
            <Tooltip title="Play Playlist" placement="top">
              <div className="relative">
                <ButtonPlayer
                  current={trackCurrent?._id}
                  className="w-16 h-16 bg-green-500 hover:bg-green-400 shadow-lg hover:shadow-green-500/25 transition-all duration-200 hover:scale-105"
                  isPlaying={isPlaying}
                  togglePlay={() => handlePlayer(item)}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPlaylistDetail;
