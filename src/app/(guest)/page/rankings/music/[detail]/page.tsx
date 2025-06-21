"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { sendRequest } from "@/utils/api";
import { formatDateTimeVn } from "@/utils/utils";
import MusicPlayer from "@/components/music/music.player";
import { useGlobalContext } from "@/library/global.context";

interface Top50MusicItem {
  title: string;
  background: string;
  playing: boolean;
  thumbnailBackground: string;
}

interface Top50Musics {
  [key: string]: Top50MusicItem[];
}

const top50Musics: Top50Musics = {
  Weekly: [
    {
      title: "Top 50 - Listens",
      background: "bg-gradient-to-br from-red-500 to-yellow-400",
      thumbnailBackground: "bg-gradient-to-tr from-red-400 to-yellow-300",
      playing: false,
    },
    {
      title: "Top 50 - Reactions",
      background: "bg-gradient-to-br from-teal-400 to-purple-500",
      thumbnailBackground: "bg-gradient-to-tr from-teal-300 to-purple-400",
      playing: false,
    },
    {
      title: "Viral 50 - Linked",
      background: "bg-gradient-to-br from-orange-500 to-pink-600",
      thumbnailBackground: "bg-gradient-to-tr from-orange-400 to-pink-500",
      playing: false,
    },
  ],
  Monthly: [
    {
      title: "Top 50 - Listens",
      background: "bg-gradient-to-br from-blue-500 to-indigo-400",
      thumbnailBackground: "bg-gradient-to-tr from-blue-400 to-indigo-300",
      playing: false,
    },
    {
      title: "Top 50 - Reactions",
      background: "bg-gradient-to-br from-green-400 to-teal-500",
      thumbnailBackground: "bg-gradient-to-tr from-green-300 to-teal-400",
      playing: false,
    },
    {
      title: "Viral 50 - Linked",
      background: "bg-gradient-to-br from-purple-500 to-pink-600",
      thumbnailBackground: "bg-gradient-to-tr from-purple-400 to-pink-500",
      playing: false,
    },
  ],
  Yearly: [
    {
      title: "Top 50 - Listens",
      background: "bg-gradient-to-br from-yellow-500 to-orange-400",
      thumbnailBackground: "bg-gradient-to-tr from-yellow-400 to-orange-300",
      playing: false,
    },
    {
      title: "Top 50 - Reactions",
      background: "bg-gradient-to-br from-pink-400 to-red-500",
      thumbnailBackground: "bg-gradient-to-tr from-pink-300 to-red-400",
      playing: false,
    },
    {
      title: "Viral 50 - Linked",
      background: "bg-gradient-to-br from-teal-500 to-blue-600",
      thumbnailBackground: "bg-gradient-to-tr from-teal-400 to-blue-500",
      playing: false,
    },
  ],
  AllTime: [
    {
      title: "Top 50 - Listens",
      background: "bg-gradient-to-br from-purple-500 to-blue-400",
      thumbnailBackground: "bg-gradient-to-tr from-purple-400 to-blue-300",
      playing: false,
    },
    {
      title: "Top 50 - Reactions",
      background: "bg-gradient-to-br from-orange-400 to-yellow-500",
      thumbnailBackground: "bg-gradient-to-tr from-orange-300 to-yellow-400",
      playing: false,
    },
    {
      title: "Viral 50 - Linked",
      background: "bg-gradient-to-br from-red-500 to-pink-600",
      thumbnailBackground: "bg-gradient-to-tr from-red-400 to-pink-500",
      playing: false,
    },
  ],
};

const DetailPage = ({ params }: { params: { detail: string } }) => {
  const [isDonePlaying, setIsDonePlaying] = useState(false);
  const [currentMusicPlaying, setCurrentMusicPlaying] = useState(0);
  const { setTrackCurrent } = useGlobalContext()!;
  const detail = decodeURIComponent(params.detail);
  const [musicData, setMusicData] = useState<IMusic[]>([]);

  useEffect(() => {
    getMusicData();
  }, []);
  useEffect(() => {
    if (isDonePlaying) {
      if (currentMusicPlaying < musicData.length - 1) {
        setTrackCurrent(musicData[currentMusicPlaying + 1]);
        setCurrentMusicPlaying(currentMusicPlaying + 1);
        setIsDonePlaying(false);
      } else {
        setTrackCurrent(musicData[0]);
        setCurrentMusicPlaying(0);
      }
    }
  }, [isDonePlaying]);

  const getMusicData = async () => {
    try {
      const res = await sendRequest<IBackendRes<IMusic[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/getTopMusic/${detail}`,
        method: "GET",
      });
      setMusicData(res.data || []);
    } catch (error) {
      console.log("Failed to fetch top one videos:", error);
    }
  };

  const getBackground = (detail: string) => {
    const [type, timeframe] = detail.split("-");

    const normalizedTimeframe =
      timeframe == "alltime"
        ? "AllTime"
        : timeframe.charAt(0).toUpperCase() + timeframe.slice(1).toLowerCase();

    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    const fullTitle =
      type.toLowerCase() === "linked"
        ? `Viral 50 - ${normalizedType}`
        : `Top 50 - ${normalizedType}`;
    const musicItem = top50Musics[normalizedTimeframe]?.find(
      (item) => item.title === fullTitle
    );

    return musicItem?.background || "bg-gray-500";
  };
  const getThumbnailBackground = (detail: string) => {
    const [type, timeframe] = detail.split("-");

    const normalizedTimeframe =
      timeframe == "alltime"
        ? "AllTime"
        : timeframe.charAt(0).toUpperCase() + timeframe.slice(1).toLowerCase();

    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    const fullTitle =
      type.toLowerCase() === "linked"
        ? `Viral 50 - ${normalizedType}`
        : `Top 50 - ${normalizedType}`;
    const musicItem = top50Musics[normalizedTimeframe]?.find(
      (item) => item.title === fullTitle
    );

    return musicItem?.thumbnailBackground || "bg-gray-500";
  };
  const description = `Ranking of Musics with the highest ${detail.split("-")[0] === "Listens"
      ? " listened musics"
      : detail.split("-")[0] === "Reactions"
        ? " reacted musics"
        : " linked videos"
    } of the ${detail.split("-")[1] == "alltime"
      ? "All Time"
      : detail.split("-")[1].charAt(0).toUpperCase() +
      detail.split("-")[1].slice(1).toLowerCase()
    }.`;
  const stats = `Stiktify • ${musicData.length.toLocaleString()} musics • ${new Date().toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  )}`;

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .scrollbar-hidden {
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hidden">
        {/* Header */}
        <div className={`flex items-end p-6 ${getThumbnailBackground(detail)}`}>
          <div
            className={`${getBackground(
              detail
            )} font-bold text-white mr-5 playlist-card w-48 h-48 rounded-lg overflow-hidden flex flex-col justify-center relative`}
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-white drop-shadow-lg mb-5">
                {detail.split("-")[0] == "Linked" ? "Viral 50" : "Top 50"} -{" "}
                {detail.split("-")[0]}
              </h2>
              <div className="w-20 h-px bg-white mx-auto mb-5"></div>
              <p className="text-sm text-white drop-shadow-lg">
                {detail.split("-")[1] == "alltime"
                  ? "All Time"
                  : detail.split("-")[1].charAt(0).toUpperCase() +
                  detail.split("-")[1].slice(1).toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold mb-2 text-white">
              {detail.split("-")[0] == "Linked" ? "Viral 50" : "Top 50"} -{" "}
              {detail.split("-")[0]}
            </h1>
            <p className="text-sm text-gray-200 mb-2">{description}</p>
            <p className="text-sm text-gray-300">{stats}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center p-6 bg-gray-100">
          <button
            onClick={() => {
              if (musicData.length > 0) {
                setTrackCurrent(musicData[0]);
                setCurrentMusicPlaying(0);
              }
            }}
            className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mr-4"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-black mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-black">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <div className="ml-auto text-gray-600 hover:text-black">
            List : <span className="font-bold">≡</span>
          </div>
        </div>

        {/* Song List */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 text-gray-600 text-sm font-semibold border-b border-gray-300 pb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Listeners</div>
            <div className="col-span-3">Reactions</div>
            <div className="col-span-1 text-right">Create</div>
          </div>

          {musicData.map((music, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-gray-100 rounded-lg"
            >
              <button
                onClick={() => {
                  setTrackCurrent(musicData[index]);
                  setCurrentMusicPlaying(index);
                }}
                className="col-span-1 w-8 h-8 flex items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-green-500 hover:text-white group"
              >
                <span className="group-hover:hidden">{index + 1}</span>
                <span className="hidden group-hover:block">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
              <div className="col-span-5 flex items-center">
                <div className="relative w-10 h-10 mr-3">
                  <Image
                    src={music?.musicThumbnail}
                    alt={music?.musicDescription}
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                    fill
                    className="rounded"
                  />
                </div>
                <div>
                  <p className="text-black font-medium">
                    {music.musicDescription}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {music.userId.fullname}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-gray-600">
                {music.totalListener.toLocaleString()}
              </div>
              <div className="col-span-2 text-gray-600">
                {music.totalFavorite}
              </div>
              <div className="col-span-2 text-gray-600 text-right">
                {formatDateTimeVn(music.createdAt)}
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 right-20 bg-white shadow-lg z-50">
          <MusicPlayer setIsDonePlaying={setIsDonePlaying} />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
