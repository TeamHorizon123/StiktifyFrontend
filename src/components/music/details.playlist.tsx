"use client"
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/library/global.context";
import { MdFavoriteBorder } from "react-icons/md";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { capitalizeWords, formatDateTimeVn, formatNumber } from "@/utils/utils";
import { IoIosMusicalNotes } from "react-icons/io";
import ButtonPlayer from "./button.player";
import { Tooltip } from "antd";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"
import WaveAnimation from "../wave/wave.animation";
interface IProps {
  item: IMusicInPlaylist[] | []
  playlist: IPlaylist
}
const DisplayPlaylistDetail = (props: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying, listPlaylist, setListPlayList } = useGlobalContext()!
  const router = useRouter()
  const { item, playlist } = props

  const handleNavigate = () => {
    router.back()
  }

  const handlePlayer = (trackList: IMusicInPlaylist[]) => {
    if (trackList && trackList.length > 0) {
      setListPlayList(trackList)
      return setIsPlaying(!isPlaying)
    }
    // if (trackCurrent?._id !== track._id) {
    //     const data = {
    //         _id: track._id,
    //         musicDescription: track.musicDescription,
    //         musicThumbnail: track.musicThumbnail,
    //         musicUrl: track.musicUrl
    //     }
    //     setTrackCurrent(data);
    //     localStorage.setItem("trackCurrent", JSON.stringify(data));
    //     return setIsPlaying(isPlaying ? true : !isPlaying)
    // }
    // return setIsPlaying(!isPlaying)
  }
  return (
    <div className="h-[40vh] w-full bg-gray-900 rounded-sm shadow-gray-400/50 flex items-center px-16 relative">
      <div
        onClick={() => handleNavigate()}
        className="absolute left-2 top-3 bg-gray-800 rounded-full hover:bg-gray-700">
        <IoMdArrowRoundBack
          color="white"
          className="m-2"
          size={20} />
      </div>
      <div className="flex w-full justify-between items-end">
        <div className="flex gap-5 items-center justify-around">
          <Image
            alt="thumbnail"
            src={playlist && playlist.image !== "" ? playlist.image : noImagePlaylist}
            width={200}
            height={100}
            className="rounded-md" />
          <div className="">
            <div className="text-white text-[100px] font-roboto font-bold">{playlist?.name}</div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <div className="flex gap-2 items-center cursor-pointer">
                  <IoIosMusicalNotes size={20} className="text-gray-400" />
                  <span className="text-gray-400">{item.length}</span>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex gap-2 items-center cursor-pointer">
                  <HiOutlineCalendarDateRange size={20} className="text-gray-400" />
                  <span className="text-gray-400">{formatDateTimeVn(playlist?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Tooltip title={"Random"}>
            <ButtonPlayer current={trackCurrent?._id} className="w-16 h-16" isPlaying={isPlaying} togglePlay={() => handlePlayer(item)} />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default DisplayPlaylistDetail;