"use client";

import { useGlobalContext } from "@/library/global.context";
import CardMusic from "./card.music";
import InputCustomize from "../input/input.customize";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  handleFilterSearchMusic,
  handleGetDataHotMusic,
  handleGetRecommendMusic,
  handleGetRecentlyPlayedMusic,
} from "@/actions/music.action";
import DropdownCustomizeFilterMusic from "../dropdown/dropdownFilterMusic";
import { handleGetPlaylistAction } from "@/actions/playlist.action";
import { AuthContext } from "@/context/AuthContext";
import RecommendMusicList from "./recommend.music";
import HotMusicList from "./hot.music.list";
import RecentlyPlayedList from "./recently.played";

interface IProps {
  data: IMusic[];
}

const ListMusic = (props: IProps) => {
  const {
    setTrackCurrent,
    trackCurrent,
    isPlaying,
    setIsPlaying,
    playlist,
    setPlaylist,
    refreshPlaylist,
    listPlaylist,
    setListPlayList,
    setFlag,
  } = useGlobalContext()!;
  const { data } = props;
  const [search, setSearch] = useState<string>("");
  const [filterReq, setFilterReq] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IMusic[]>(data);
  const { user } = useContext(AuthContext)!;
  const [dataRecommend, setDataRecommend] = useState<IMusic[] | []>([]);
  const [dataHotMusic, setDataHotMusic] = useState<IMusic[] | []>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<IMusic[] | []>([]);

  useEffect(() => {
    setListPlayList([]);
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        const res = await handleGetPlaylistAction(user._id);
        if (res?.statusCode === 200) {
          setPlaylist(res.data.result);
        }
      }
    })();
  }, [user, refreshPlaylist]);

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === "") {
        setFilteredData(data);
        return;
      }
      try {
        const response = await handleFilterSearchMusic("1", "30");
        if (!response || !response.data || !response.data.result) {
          setFilteredData([]);
          return;
        }
        if (Array.isArray(response.data.result)) {
          const filtered = response.data.result.filter((music: IMusic) =>
            music.musicDescription.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredData(filtered);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        setFilteredData([]);
      }
    };
    fetchData();
  }, [search, data]);

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      setFlag(false);
      setTrackCurrent(track);
      if (listPlaylist && listPlaylist.length > 0) {
        setListPlayList([]);
      }
      localStorage.setItem("trackCurrent", JSON.stringify(track));

      // Thêm vào recently played (localStorage)
      const recentPlayed = JSON.parse(
        localStorage.getItem("recentlyPlayed") || "[]"
      );
      const existingIndex = recentPlayed.findIndex(
        (item: IMusic) => item._id === track._id
      );

      if (existingIndex > -1) {
        recentPlayed.splice(existingIndex, 1);
      }

      recentPlayed.unshift(track);
      const limitedRecent = recentPlayed.slice(0, 10); // Giới hạn 10 bài gần nhất
      localStorage.setItem("recentlyPlayed", JSON.stringify(limitedRecent));
      setRecentlyPlayed(limitedRecent);

      return setIsPlaying(isPlaying ? true : !isPlaying);
    }
    return setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const res = await handleGetRecommendMusic(user._id);
        const resHotMusic = await handleGetDataHotMusic();
        console.log("Hot Music:", resHotMusic);


        setDataHotMusic(resHotMusic?.data);
        setDataRecommend(res?.data);
      }

      // Load recently played từ localStorage
      const recentPlayed = JSON.parse(
        localStorage.getItem("recentlyPlayed") || "[]"
      );
      setRecentlyPlayed(recentPlayed);
    })();
  }, [user]);

  return (
    <div className="main-layout min-h-screen text-white pr-[4%]">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Music</h1>
          <div className="flex gap-4">
            <div>
              <DropdownCustomizeFilterMusic
                title="Filter"
                selected={filterReq}
                setSelect={(value: any) => setFilterReq(value)}
                icon={<FilterOutlined />}
              />
            </div>
          </div>
        </div>

        {/* Featured Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filteredData.slice(0, 3).map((item, index) => (
            <div
              key={item._id}
              className={`relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 ${index === 0 ? "col-span-1 md:col-span-1" : "col-span-1"
                }`}
              onClick={() => handlePlayer(item)}
            >
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <img
                  src={item.musicThumbnail}
                  alt={item.musicDescription}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold mb-1">
                  {item.musicDescription}
                </h3>
                <p className="text-gray-300 text-sm">
                  {item.musicTag?.map((tag) => tag.fullname).join(", ") ||
                    "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 space-y-12">
        {/* Recently Played */}
        {recentlyPlayed && recentlyPlayed.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Recently Played</h2>
            <RecentlyPlayedList data={recentlyPlayed} />
          </div>
        )}

        {/* Recommend Music */}
        {user && dataRecommend && dataRecommend.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Made for You</h2>
            <RecommendMusicList data={dataRecommend} />
          </div>
        )}

        {/* Hot Music */}
        {dataHotMusic && dataHotMusic.length > 0 && (
          <div className="w-[72rem]">
            <h2 className="text-3xl font-bold mb-6">Popular This Week</h2>
            <HotMusicList data={dataHotMusic} />
          </div>
        )}

        {/* All Music Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item._id} className="w-full">
                  <CardMusic
                    handlePlayer={handlePlayer}
                    isPlaying={isPlaying}
                    item={item}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-20">
                <p className="text-gray-400 text-xl">No songs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMusic;
