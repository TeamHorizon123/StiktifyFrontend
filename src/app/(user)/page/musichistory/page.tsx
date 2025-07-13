"use client";

import { useState, useEffect } from "react";
import ListenedHistory from "@/components/page/history/listened-history";
import SettingListenHistory from "@/components/page/history/setting-listen-history";
import Header from "@/components/page/trending/header";
import { handleSearchHistory } from "@/actions/music.action";

interface Music {
  _id: string;
  musicDescription: string;
  musicThumbnail: string;
  musicUrl: string;
  totalListener: number;
  totalReactions: number;
}

interface ListeningHistory {
  _id: string;
  musicId: Music;
  createdAt: string;
}

const HistoryMusicPage = () => {
  const [history, setHistory] = useState<ListeningHistory[]>([]);
  const [watchedDate, setWatchedDate] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedMusic, setSearchedMusic] = useState<ListeningHistory[]>([]);



  const handleSearchMusic = async (search: string) => {
    if (search.trim()) {
      const result = await handleSearchHistory(search);
      if (result?.data?.result) {
        const uniqueMusic: ListeningHistory[] = [];
        const musicIds = new Set<string>();

        result.data.result.forEach((item: ListeningHistory) => {
          const music = item.musicId;
          if (!musicIds.has(music?._id)) {
            musicIds.add(music?._id);
            uniqueMusic.push(item);
          }
        });

        setSearchedMusic(uniqueMusic);
      } else {
        setSearchedMusic([]);
      }
    } else {
      setSearchedMusic([]);
    }
  };

  const handleFilterDate = (date: string) => {
    setWatchedDate(date);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchedMusic([]);
  };

  useEffect(() => {
    if (watchedDate && history.length > 0) {
      const filteredHistory = history.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        return itemDate === watchedDate;
      });
      setSearchedMusic(filteredHistory);
    } else if (!searchValue) {
      setSearchedMusic([]); // Đảm bảo quay lại danh sách gốc khi không lọc
    }
  }, [watchedDate, history, searchValue]);

  return (
    <div className="flex-grow p-5 ml-64">
      {/* <div>
        <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isGuest={false}
          onClick={() => handleSearchMusic(searchValue)}
        />
      </div> */}
      <div className="flex p-4">
        <div className="flex-1 mr-8 bg-[#18182c] p-4 text-white">
          {searchedMusic.length > 0 ? (
            <div className="space-y-4">
              {searchedMusic.map((item) => {
                const music = item.musicId;
                return (
                  <div
                    key={item._id}
                    className="flex items-center bg-[#18182c] shadow-md rounded-lg p-4"
                  >
                    <img
                      src={music?.musicThumbnail}
                      className="w-32 h-32 object-cover rounded-md shadow-sm cursor-pointer"
                      alt={music?.musicDescription}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white-900">
                        {music?.musicDescription}
                      </h3>
                      <p className="text-sm text-white-700">
                        Views: {music?.totalListener || 0}
                      </p>
                      <p className="text-sm text-white-700">
                        Reactions: {music?.totalReactions || 0}
                      </p>
                      <p className="text-sm text-white-700">
                        View At: {new Date(item.createdAt).toLocaleTimeString()}{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchValue.trim() ? (
            <p className="text-center text-white-500">No results found.</p>
          ) : (
            <ListenedHistory setHistory={setHistory} />
          )}
        </div>
        <div className="w-[30%] p-5">
          <SettingListenHistory
            setHistory={setHistory}
            onChange={handleFilterDate}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryMusicPage;