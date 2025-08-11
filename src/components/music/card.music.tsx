"use client";

import Image from "next/image";
import ButtonPlayer from "./button.player";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/library/global.context";
import { Dropdown, MenuProps, Modal, notification, Tooltip } from "antd";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg";
import { handleAddMusicInPlaylistAction } from "@/actions/playlist.action";
import AddPlayList from "../modal/modal.add.playlist";
import { AuthContext } from "@/context/AuthContext";
import { MoreHorizontal, Plus, Play, Pause } from "lucide-react";
import { handleDeleteMusic } from "@/actions/music.action";
import UpdateMusicModal from "../modal/modal.update.music";
import { handleGetAllCategoryAction } from "@/actions/category.action";

interface IProps {
  showPlaying?: boolean;
  handlePlayer: (v: any) => void;
  isPlaying: boolean;
  item: IMusic;
  ref?: any;
  isEdit?: boolean;
  refreshList?: any
  className?: any
}

const CardMusic = (props: IProps) => {
  const {
    handlePlayer,
    isPlaying,
    item,
    ref,
    showPlaying = true,
    isEdit,
    refreshList
  } = props;
  const { trackCurrent, playlist } = useGlobalContext()!;
  const { user } = useContext(AuthContext)!;
  const [hoverPlayer, setHoverPlayer] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<MenuProps["items"] | []>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { className = "" } = props;
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [listCate, setListCate] = useState([]);
  const handleItem = (track: IMusic) => {
    handlePlayer(track);
  };

  const handleNavigate = (id: string) => {
    router.push(`/page/music/${id}`);
  };


  useEffect(() => {
    if (trackCurrent?._id === item._id) {
      setHoverPlayer(true);
    } else {
      setHoverPlayer(false);
    }
  }, [trackCurrent, item]);

  useEffect(() => {
    (async () => {
      const res = await handleGetAllCategoryAction();
      if (res?.statusCode === 200) {
        return setListCate(res.data);
      }
      setListCate([]);
    })();
  }, [isOpenUpdateModal]);

  useEffect(() => {
    const playlistArr: MenuProps["items"] = [];
    if (playlist && playlist.length > 0) {
      playlist.map((playlistItem, index) => {
        const config = {
          key: playlistItem._id,
          label: (
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
              <Image
                height={40}
                width={40}
                className="rounded-md"
                alt="thumbnail"
                src={
                  !playlistItem.image || playlistItem.image === ""
                    ? noImagePlaylist
                    : playlistItem.image
                }
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{playlistItem.name}</div>
                <div className="text-gray-500 text-xs truncate max-w-[150px]">
                  {playlistItem.description}
                </div>
              </div>
            </div>
          ),
        };
        playlistArr.push(config);
      });
    }

    const addNewPlaylist = {
      key: playlistArr.length + 1,
      label: (
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-medium">Create New Playlist</span>
        </div>
      ),
    };
    playlistArr.push(addNewPlaylist);

    const menuItems: MenuProps["items"] = [
      {
        key: "add_to_playlist",
        label: "Add to Playlist",
        children: playlistArr,
        expandIcon: null,
      },
    ];

    // Nếu isEdit thì thêm nút Update và Delete vào menu
    if (isEdit) {
      menuItems.push(
        {
          key: "edit",
          label: "Update",
        },
        {
          key: "delete",
          label: "Delete",
        }
      );
    }

    setItems(menuItems);
  }, [playlist]);

  const handleAddMusicInPlaylist = async (playlistId: string) => {
    if (user) {
      if (playlistId.length >= 10) {
        const res = await handleAddMusicInPlaylistAction(playlistId, item._id);
        if (res?.statusCode === 201) {
          return notification.success({ message: res.message });
        }
        return notification.warning({ message: res?.message });
      }
      if (playlist.length < 3) {
        return setIsOpenModal(true);
      }
      return notification.warning({
        message: "Please upgrade to Premium to continue using this feature",
      });
    }

    return router.push("/auth/login");
  };

  return (
    <>
      <div
        ref={ref}
        onClick={() => handleNavigate(item._id)}
        onMouseLeave={() => {
          trackCurrent?._id !== item._id && setHoverPlayer(false);
        }}
        onMouseEnter={() => setHoverPlayer(true)}
        className={`group relative bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 transition-all duration-300 cursor-pointer h-full flex flex-col ${className}`}
      >
        {/* Album Art */}
        <div className="relative aspect-square mb-4 rounded-md overflow-hidden">
          <Image
            alt="thumbnail"
            className="object-cover"
            fill
            src={item ? item.musicThumbnail : "/default-music.jpg"}
          />

          {/* Play Button Overlay */}
          {showPlaying && (
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${hoverPlayer || (trackCurrent?._id === item._id && isPlaying)
                ? "opacity-100"
                : "opacity-0"
                }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItem(item);
                }}
                className="w-12 h-12 bg-purple-500 hover:bg-purple-400 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-200"
              >
                {trackCurrent?._id === item._id && isPlaying ? (
                  <Pause className="w-6 h-6 text-black" fill="currentColor" />
                ) : (
                  <Play
                    className="w-6 h-6 text-black ml-1"
                    fill="currentColor"
                  />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          {/* Title và Add to Playlist Button */}
          <div className="flex items-center justify-between gap-2">
            <Tooltip title={item.musicDescription}>
              <h3 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors flex-1">
                {item.musicDescription}
              </h3>
            </Tooltip>

            {/* Dropdown Menu - Add to Playlist */}
            <Dropdown
              menu={{
                items,
                onClick: (e) => {
                  e.domEvent.stopPropagation();

                  if (e.key === "delete") {
                    Modal.confirm({
                      title: "Are you sure you want to delete this music?",
                      content: "This action cannot be undone.",
                      okText: "Yes",
                      cancelText: "No",
                      okType: "danger",
                      onOk: async () => {
                        const res = await handleDeleteMusic(item._id);
                        if (res?.statusCode === 200) {
                          notification.success({ message: "Music deleted successfully!" });
                          refreshList?.();

                          // OPTIONAL: reload page or refetch data
                        } else {
                          notification.error({ message: res?.message || "Failed to delete music." });
                        }
                      },
                    });
                    return;
                  }

                  if (e.key === "edit") {
                    setIsOpenUpdateModal(true);
                    return;
                  }

                  // Xử lý thêm vào playlist
                  handleAddMusicInPlaylist(e.key);
                },
              }}
              trigger={["click"]}
            >
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full bg-gray-700/50 opacity-0 opacity-100 transition-all duration-300 hover:bg-purple-500/50 flex-shrink-0"
              >
                <MoreHorizontal className="w-4 h-4 text-white" />
              </button>
            </Dropdown>
          </div>

          <p className="text-gray-400 text-sm truncate">
            {item?.userId?.fullname || "Unknown Artist"}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.totalListener?.toLocaleString() || 0} plays</span>
          </div>

        </div>
      </div>
      <AddPlayList isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <UpdateMusicModal
        isOpen={isOpenUpdateModal}
        setIsOpen={setIsOpenUpdateModal}
        initialData={{
          musicId: item._id,
          musicDescription: item.musicDescription,
          musicThumbnail: item.musicThumbnail,
        }} listCate={listCate}
        refreshList={refreshList}
      />
    </>
  );
};

export default CardMusic;
