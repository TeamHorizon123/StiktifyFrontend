"use client";
import { sendRequest } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IVideo {
  totalViews?: number;
  totalReactions?: number;
  image: string;
  playing: boolean;
}

interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface Top50Videos {
  [key: string]: IVideo[];
}

interface Top50MusicItem {
  title: string;
  background: string;
  playing: boolean;
}

interface Top50Musics {
  [key: string]: Top50MusicItem[];
}

interface Top50CreatorItem {
  title: string;
  image: string;
  playing: boolean;
}

interface Top50Creators {
  [key: string]: Top50CreatorItem[];
}
const Rankings = () => {
  const [musicTab, setMusicTab] = useState<string>("Weekly");
  const [videoTab, setVideoTab] = useState<string>("Weekly");
  const [creatorTab, setCreatorTab] = useState<string>("Weekly");
  const [top50Videos, setTop50Videos] = useState<Top50Videos>({});
  const timePeriods: string[] = ["Weekly", "Monthly", "Yearly", "AllTime"];
  const router = useRouter();

  const formatTopVideosData = (apiData: Top50Videos): Top50Videos => {
    const formattedData: Top50Videos = {};
    for (const period in apiData) {
      formattedData[period] = apiData[period].map((item) => ({
        ...item,
        playing: false,
      }));
    }
    return formattedData;
  };

  const getTopOneVideos = async () => {
    try {
      const res = await sendRequest<IBackendRes<Top50Videos>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/get-top-one-videos`,
        method: "GET",
      });
      const formattedData = formatTopVideosData(res.data || {});
      setTop50Videos(formattedData);
    } catch (error) {
      console.log("Failed to fetch top one videos:", error);
      setTop50Videos({});
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    getTopOneVideos();
  }, []);
  const top50Musics: Top50Musics = {
    Weekly: [
      {
        title: "Top 50 - Listens",
        background: "bg-gradient-to-br from-red-500 to-yellow-400",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        background: "bg-gradient-to-br from-teal-400 to-purple-500",
        playing: false,
      },
      {
        title: "Viral 50 - Linked",
        background: "bg-gradient-to-br from-orange-500 to-pink-600",
        playing: false,
      },
    ],
    Monthly: [
      {
        title: "Top 50 - Listens",
        background: "bg-gradient-to-br from-blue-500 to-indigo-400",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        background: "bg-gradient-to-br from-green-400 to-teal-500",
        playing: false,
      },
      {
        title: "Viral 50 - Linked",
        background: "bg-gradient-to-br from-purple-500 to-pink-600",
        playing: false,
      },
    ],
    Yearly: [
      {
        title: "Top 50 - Listens",
        background: "bg-gradient-to-br from-yellow-500 to-orange-400",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        background: "bg-gradient-to-br from-pink-400 to-red-500",
        playing: false,
      },
      {
        title: "Viral 50 - Linked",
        background: "bg-gradient-to-br from-teal-500 to-blue-600",
        playing: false,
      },
    ],
    AllTime: [
      {
        title: "Top 50 - Listens",
        background: "bg-gradient-to-br from-purple-500 to-blue-400",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        background: "bg-gradient-to-br from-orange-400 to-yellow-500",
        playing: false,
      },
      {
        title: "Viral 50 - Linked",
        background: "bg-gradient-to-br from-red-500 to-pink-600",
        playing: false,
      },
    ],
  };
  const top50Creators: Top50Creators = {
    Weekly: [
      {
        title: "Top 50 - Follow",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1337776692-612x612.jpg?alt=media&token=089cb71a-9a93-416c-bd37-fe2cfdfa322a",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1403883358-612x612.jpg?alt=media&token=cf11b789-2c66-4d21-be3f-c251154d72a5",
        playing: false,
      },
      {
        title: "Viral 50 - Views",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-578294308-612x612.jpg?alt=media&token=a3f27fb5-4c00-4677-9433-6fb8753bf0a0",
        playing: false,
      },
    ],
    Monthly: [
      {
        title: "Top 50 - Follow",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-877304794-612x612.jpg?alt=media&token=36a9173a-17d0-440d-b7ae-bccbf7d8fd42",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-971004950-612x612.jpg?alt=media&token=8a51cae0-9df6-4c70-ae59-0224fd1fd574",
        playing: false,
      },
      {
        title: "Viral 50 - Views",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-994303656-612x612.jpg?alt=media&token=04fdf416-022e-451a-a7f4-867be6cad4b4",
        playing: false,
      },
    ],
    Yearly: [
      {
        title: "Top 50 - Follow",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1191632784-612x612.jpg?alt=media&token=8a8ea08f-7ab8-4273-8c06-73f4310eb4a7",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1250963424-612x612.jpg?alt=media&token=6a60ba58-13af-49ad-9b64-7f0c1e3b7023",
        playing: false,
      },
      {
        title: "Viral 50 - Views",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1317619757-612x612.jpg?alt=media&token=25878c06-41b0-4c1d-b1de-358893f14a4c",
        playing: false,
      },
    ],
    AllTime: [
      {
        title: "Top 50 - Follow",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1250963256-612x612.jpg?alt=media&token=021ed396-cd19-4e72-92cb-d8c7edeeea0a",
        playing: false,
      },
      {
        title: "Top 50 - Reactions",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1319579584-612x612.jpg?alt=media&token=6d498053-4129-45ed-b325-afbc49754eb3",
        playing: false,
      },
      {
        title: "Viral 50 - Views",
        image:
          "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/creator%2Fistockphoto-1451772581-612x612.jpg?alt=media&token=71c46483-f66f-4eb9-b6bc-26bcfab70bf5",
        playing: false,
      },
    ],
  };
  return (
    <div className="min-h-screen main-layout p-4">
      <style jsx>{`[#1a0b2e]
        .scrollbar-hidden {
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="text-2xl font-bold text-white mb-10">Rankings</div>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hidden">
        {/* Phần Top 50 Musics */}
        <div className="ml-2">
          <h1 className="text-xl font-bold text-white mb-4">Top 50 Musics</h1>
          <div className="flex space-x-3 mb-4">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setMusicTab(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  musicTab === period
                    ? "bg-purple-700 text-[#1f152e]"
                    : "bg-[#1f152e]-200 text-white hover:bg-purple-600"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
            {top50Musics[musicTab].map((playlist: any, index: any) => (
              <div
                onClick={() =>
                  router.push(
                    `./rankings/music/${
                      playlist.title.split(" ")[3]
                    }-${musicTab.toLowerCase()}`
                  )
                }
                key={index}
                className={`playlist-card h-48 rounded-lg overflow-hidden flex flex-col justify-center p-3 ${playlist.background} relative transition-transform duration-200 hover:scale-105 cursor-pointer group`}
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg mb-5">
                    {playlist.title}
                  </h2>
                  <div className="w-20 h-px bg-white mx-auto mb-5"></div>
                  <p className="text-sm text-white drop-shadow-lg">
                    {musicTab}
                  </p>
                </div>
                <button
                  className={`absolute bottom-4 right-4 bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-[#1f152e] hover:bg-purple-700 transition-colors ${
                    playlist.playing ? "block" : "hidden group-hover:block"
                  }`}
                >
                  {playlist.playing ? "⏸" : "▶"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Top 50 Videos */}
        <div className="ml-2">
          <h1 className="text-xl font-bold text-white mb-4">Top 50 Videos</h1>
          <div className="flex space-x-3 mb-4">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setVideoTab(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  videoTab === period
                    ? "bg-purple-700 text-[#1f152e]"
                    : "bg-[#1f152e]-200 text-white hover:bg-gray-300"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-10">
            {top50Videos[videoTab]?.map((playlist: any, index: any) => (
              <div
                key={index}
                onClick={() =>
                  router.push(
                    `./rankings/video/${
                      playlist.title.split(" ")[3]
                    }-${videoTab.toLowerCase()}`
                  )
                }
                className={`playlist-card h-48 rounded-lg overflow-hidden relative transition-transform duration-200 hover:scale-105 cursor-pointer group`}
              >
             {playlist.image ? (
              <Image
                src={playlist.image}
                alt={playlist.title}
                sizes="200px"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            ) : (
      <div className="rounded-lg w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-black text-xl font-bold">
        No Ranking
      </div>


            )}
                <div className="relative flex flex-col justify-start p-4 h-full">
                  <h2 className="text-lg font-bold text-white drop-shadow-lg whitespace-nowrap">
                    {playlist.title}
                  </h2>
                  <p className="text-sm text-white drop-shadow-lg">
                    {videoTab}
                  </p>
                  <button
                    className={`absolute bottom-4 right-4 bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-[#1f152e] hover:bg-purple-700 transition-colors ${
                      playlist.playing ? "block" : "hidden group-hover:block"
                    }`}
                  >
                    {playlist.playing ? "⏸" : "▶"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Top 50 Creators */}
        <div className="ml-2">
          <h1 className="text-xl font-bold text-white mb-4">Top 50 Creator</h1>
          <div className="flex space-x-3 mb-4">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setCreatorTab(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  creatorTab === period
                    ? "bg-purple-700 text-[#1f152e]"
                    : "bg-[#1f152e]-200 text-white hover:bg-gray-300"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-10">
            {top50Creators[creatorTab]?.map((playlist: any, index: any) => (
              <div
                key={index}
                onClick={() =>
                  router.push(
                    `./rankings/creator/${
                      playlist.title.split(" ")[3]
                    }-${creatorTab.toLowerCase()}`
                  )
                }
                className={`playlist-card h-48 rounded-lg overflow-hidden relative transition-transform duration-200 hover:scale-105 cursor-pointer group bg-gray-200`}
              >
                {playlist.image && (
                  <Image
                    src={playlist.image}
                    alt={playlist.title}
                    sizes="200px"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                )}

                <div className="relative flex flex-col justify-start p-4 h-full">
                  <h2 className="text-lg font-bold text-white drop-shadow-lg whitespace-nowrap">
                    {playlist.title}
                  </h2>
                  <p className="text-sm text-white drop-shadow-lg">
                    {videoTab}
                  </p>
                  <button
                    className={`absolute bottom-4 right-4 bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-[#1f152e] hover:bg-purple-700 transition-colors ${
                      playlist.playing ? "block" : "hidden group-hover:block"
                    }`}
                  >
                    {playlist.playing ? "⏸" : "▶"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
