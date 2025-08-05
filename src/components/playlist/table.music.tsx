"use client";
import { formatTime, timeAgo } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, MenuProps, notification } from "antd";
import { MdOutlineMusicOff } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { handleRemoveMusicInPlaylistAction } from "@/actions/playlist.action";
import { useGlobalContext } from "@/library/global.context";
import { IoIosMusicalNotes } from "react-icons/io";

interface IProps {
  playlistP: IMusicInPlaylist[] | [];
  playlist: IPlaylist;
}

const TableListMusicInPlaylist = (props: IProps) => {
  const { playlistP, playlist } = props;
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<IMusicInPlaylist[] | []>([]);
  const [filteredData, setFilteredData] = useState<IMusicInPlaylist[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const {
    setListPlayList,
    listPlaylist,
    trackCurrent,
    setIsPlaying,
    setPrevList,
  } = useGlobalContext()!;

  useEffect(() => {
    setIsPlaying(false);
    setPrevList([]);
  }, []);

  const getDuration = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        resolve(formatTime(Math.floor(audio.duration)));
      });
      audio.addEventListener("error", () => {
        reject("Error loading audio");
      });
    });
  };

  useEffect(() => {
    setData(playlistP);
  }, [playlistP]);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.musicId.musicDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  useEffect(() => {
    data.forEach((item) => {
      getDuration(item.musicId.musicUrl!).then((duration) => {
        setDurations((prev: any) => ({
          ...prev,
          [item.musicId.musicUrl!]: duration,
        }));
      });
    });
  }, [data]);

  const items: MenuProps["items"] = [
    {
      key: "remove",
      label: (
        <div className="text-red-400 hover:text-red-300 font-medium">
          Remove from playlist
        </div>
      ),
      icon: <MdOutlineMusicOff size={18} className="text-red-400" />,
    },
  ];

  const handleRemoveMusicInPlaylist = async (id: string) => {
    const res = await handleRemoveMusicInPlaylistAction(id);

    if (res?.statusCode === 200) {
      const newPlaylist = listPlaylist.filter((x) => x.musicId._id !== id);
      setListPlayList(newPlaylist);
      return notification.success({
        message: "Removed from playlist successfully",
        style: { backgroundColor: "#1f2937", color: "white" },
      });
    }
    return notification.warning({
      message: res?.message,
      style: { backgroundColor: "#1f2937", color: "white" },
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchOutlined className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search in ${playlist?.name || "playlist"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 rounded-lg border border-gray-700/30">
        <table className="w-full text-white">
          <thead className="border-b border-gray-700/50">
            <tr className="text-gray-400 text-sm">
              <th className="w-12 text-left px-4 py-3 font-medium">#</th>
              <th className="w-12 text-left px-2 py-3"></th>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Album
              </th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                Date added
              </th>
              <th className="w-20 text-left px-4 py-3">
                <FaRegClock className="text-gray-400" size={16} />
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.length > 0 &&
              filteredData.map((item, index) => {
                const isCurrentTrack = trackCurrent?._id === item.musicId._id;
                const isHovered = hoveredIndex === index;

                return (
                  <tr
                    key={index}
                    className={`group hover:bg-gray-800/40 transition-all duration-200 rounded-lg ${
                      isCurrentTrack ? "bg-purple-900/20" : ""
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium text-sm ${
                          isCurrentTrack ? "text-purple-400" : "text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-2 py-3">
                      {isCurrentTrack && (
                        <div className="flex items-center justify-center">
                          <div className="flex items-end space-x-0.5 h-4">
                            <div
                              className="w-0.5 bg-purple-500 rounded-full animate-bounce h-2"
                              style={{
                                animationDelay: "0s",
                                animationDuration: "1s",
                              }}
                            ></div>
                            <div
                              className="w-0.5 bg-purple-500 rounded-full animate-bounce h-4"
                              style={{
                                animationDelay: "0.2s",
                                animationDuration: "1s",
                              }}
                            ></div>
                            <div
                              className="w-0.5 bg-purple-500 rounded-full animate-bounce h-3"
                              style={{
                                animationDelay: "0.4s",
                                animationDuration: "1s",
                              }}
                            ></div>
                            <div
                              className="w-0.5 bg-purple-500 rounded-full animate-bounce h-2"
                              style={{
                                animationDelay: "0.6s",
                                animationDuration: "1s",
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            className="rounded-md shadow-md"
                            src={item.musicId.musicThumbnail}
                            alt="thumbnail"
                            width={48}
                            height={48}
                          />
                          {isCurrentTrack && (
                            <div className="absolute inset-0 bg-purple-500/20 rounded-md"></div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isCurrentTrack ? "text-purple-300" : "text-white"
                            }`}
                          >
                            {item.musicId.musicDescription}
                          </span>
                          <span className="text-gray-400 text-xs truncate">
                            Artist Name
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-300 text-sm truncate">
                        {item.musicId.musicDescription}
                      </span>
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-400 text-sm">
                        {timeAgo(item.createdAt)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-sm">
                        {durations[item.musicId.musicUrl!] || "--:--"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <Dropdown
                        menu={{
                          items,
                          onClick: (e) => {
                            e.domEvent.stopPropagation();
                            handleRemoveMusicInPlaylist(item.musicId._id);
                          },
                        }}
                        placement="bottomRight"
                        overlayClassName="playlist-dropdown"
                      >
                        <button
                          className={`p-2 rounded-full transition-all duration-200 ${
                            isHovered
                              ? "bg-gray-700/50 text-white opacity-100"
                              : "text-gray-500 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <BsThreeDots size={16} />
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Empty States */}
        {data.length === 0 ? (
          <div className="text-center py-12">
            <IoIosMusicalNotes
              size={48}
              className="text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-gray-400 text-lg font-medium mb-2">
              No songs in this playlist
            </h3>
            <p className="text-gray-500 text-sm">
              Add some music to get started
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <SearchOutlined className="text-gray-600 text-4xl mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg font-medium mb-2">
              No songs found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search terms
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TableListMusicInPlaylist;
