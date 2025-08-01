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
import { PiMusicNotesMinusBold } from "react-icons/pi";
import { handleDeletePlaylist } from "@/actions/playlist.action";

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

  const cancel = (e: any) => {
    console.log(e);
    message.error("Click on No");
  };
  return (
    <>
      {user && (
        <>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 shadow-sm mt-1">
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
                    <div className="absolute right-0 bg-red-600 p-[3px] rounded-sm cursor-pointer">
                      <Popconfirm
                        title="Are you sure delete this playlist?"
                        onConfirm={() => confirm(item._id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        placement="topLeft"
                        okButtonProps={{
                          style: { color: "white", background: "red" },
                        }}
                      >
                        <PiMusicNotesMinusBold color="white" size={15} />
                      </Popconfirm>
                    </div>
                    <div
                      onClick={() => handleNavigate(item._id)}
                      className="cursor-pointer flex items-center justify-center w-14 h-14 bg-white rounded-md"
                    >
                      <Image
                        width={100}
                        height={100}
                        className="rounded-md w-full h-full"
                        alt="thumbnail"
                        src={
                          !item.image || item.image === ""
                            ? noImagePlaylist
                            : item.image
                        }
                      />
                    </div>
                  </Tooltip>
                ))}
              <div
                onClick={() => setIsOpenModal(true)}
                className="flex items-center justify-center w-14 h-14 bg-white rounded-md cursor-pointer"
              >
                <IoMdAdd color="gray" size={20} />
              </div>
            </div>
            <Tooltip title={"Add music"} placement="left">
              <div
                onClick={() => setIsOpenModalMusic(true)}
                className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-md cursor-pointer mb-1"
              >
                <PiMusicNotesPlusBold color="white" size={20} />
              </div>
            </Tooltip>
          </div>
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
    </>
  );
};

export default SideBarPlaylist;
