"use client";
import { useGlobalContext } from "@/library/global.context";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg";
import { useContext, useEffect, useState } from "react";
import AddPlayList from "../modal/modal.add.playlist";
import { message, notification, Popconfirm, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import AddMusicModal from "../modal/modal.add.music";
import { handleGetAllCategoryAction } from "@/actions/category.action";
import { AuthContext } from "@/context/AuthContext";
import { handleDeletePlaylist } from "@/actions/playlist.action";
import { DeleteFilled } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";

const SideBarPlaylist = () => {
  const { playlist, progressUploadMusic, setPlaylist } = useGlobalContext()!;
  const { user } = useContext(AuthContext)!;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalAddMusic, setIsOpenModalMusic] = useState(false);
  const [listCate, setListCate] = useState([]);
  const router = useRouter();
  const [checkProgress, setCheckProgress] = useState(0);
  const handleNavigate = (playlistId: string) => {
    router.push(`music/playlist?playlistId=${playlistId}`);
  };

  useEffect(() => {
    setCheckProgress(progressUploadMusic);
  }, [progressUploadMusic]);

  const openCreateMusic = (v: boolean) => {
    if (checkProgress === 0) {
      setIsOpenModalMusic(v);
    } else {
      notification.warning({
        message:
          "There is a process running please try again after the process is complete",
      });
    }
  };

  useEffect(() => {
    (async () => {
      const res = await handleGetAllCategoryAction();
      if (res?.statusCode === 200) {
        return setListCate(res.data);
      }
      setListCate([]);
    })();
  }, [isOpenModalAddMusic]);

  const confirm = async (id: string) => {
    const res = await handleDeletePlaylist(id);
    console.log("res>>>>>>", res);
    const newList = playlist.filter((x) => x._id !== id);
    setPlaylist(newList);
    if (res?.statusCode === 200) {
      message.success("Deleted successfully");
    }
  };

  return (
    <div className="h-full w-16 bg-purple-800/50 backdrop-blur-md flex flex-col justify-between shadow-bg-purple-500/50">
      {user && (
        <>
          {/* Nội dung chính (scrollable) */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Danh sách Playlist */}
            <div className="flex flex-col gap-2 overflow-y-auto px-1 py-2 flex-grow min-h-0">
              {playlist &&
                playlist.length > 0 &&
                playlist.map((item) => (
                  <Tooltip
                    key={item._id}
                    placement="left"
                    overlayInnerStyle={{
                      background: "white",
                      color: "#1e272e",
                    }}
                    title={item.name}
                  >
                    <div className="relative group">
                      {/* Nút xóa playlist */}
                      <div className="absolute -top-1 -right-1 bg-gray-800/90 hover:bg-red-500/90 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-sm">
                        <Popconfirm
                          title="Delete this playlist?"
                          description="This action cannot be undone."
                          onConfirm={() => confirm(item._id)}
                          okText="Delete"
                          cancelText="Cancel"
                          placement="topLeft"
                          okButtonProps={{
                            style: {
                              color: "white",
                              background: "#ef4444",
                              borderColor: "#ef4444",
                              fontWeight: "500",
                            },
                          }}
                          cancelButtonProps={{
                            style: {
                              color: "#6b7280",
                              borderColor: "#d1d5db",
                              background: "gray",
                            },
                          }}
                        >
                          <div className="w-3 h-3 flex items-center justify-center hover:scale-110 transition-transform">
                            <RiDeleteBin6Line color="white" size={12} />
                          </div>
                        </Popconfirm>
                      </div>

                      {/* Playlist item */}
                      <div
                        onClick={() => handleNavigate(item._id)}
                        className="cursor-pointer flex items-center justify-center w-12 h-12 bg-white rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:ring-2 group-hover:ring-purple-400/50"
                      >
                        <Image
                          width={100}
                          height={100}
                          className="rounded-md w-full h-full object-cover"
                          alt="thumbnail"
                          src={
                            !item.image || item.image === ""
                              ? noImagePlaylist
                              : item.image
                          }
                        />
                      </div>
                    </div>
                  </Tooltip>
                ))}
            </div>

            {/* Nút tạo playlist */}
            <div className="py-1">
              <Tooltip title="Create new playlist" placement="left">
                <div
                  onClick={() => setIsOpenModal(true)}
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md cursor-pointer transition-transform hover:scale-105 mx-auto"
                >
                  <IoMdAdd color="white" size={20} />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Footer: Upload music */}
          <div className="p-2">
            <Tooltip title="Add new music" placement="left">
              <div
                onClick={() => setIsOpenModalMusic(true)}
                className="flex items-center justify-center w-12 h-12 bg-purple-500 from-blue-500 to-cyan-500 rounded-md cursor-pointer transition-transform hover:scale-105 mx-auto"
              >
                <PiMusicNotesPlusBold color="white" size={20} />
              </div>
            </Tooltip>
          </div>

          {/* Modals */}
          <AddPlayList
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
          />
          <AddMusicModal
            listCate={listCate}
            isCreateModalOpen={isOpenModalAddMusic}
            setIsCreateModalOpen={openCreateMusic}
          />
        </>
      )}
    </div>
  );
};

export default SideBarPlaylist;
