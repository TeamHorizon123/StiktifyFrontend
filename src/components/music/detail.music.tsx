"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { useRouter } from "next/navigation";
import ButtonPlayer from "./button.player";
import { useGlobalContext } from "@/library/global.context";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { BiFlag } from "react-icons/bi";
import { capitalizeWords, formatNumber } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";
import ReportModal from "./comment/report_music";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { handleLikeMusicAction } from "@/actions/music.action";
import { notification } from "antd";

interface IProps {
  item: IMusic;
}

const DisplayMusicDetail = ({ item }: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying, setFlag } =
    useGlobalContext()!;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [totalFavorite, setTotalFavorite] = useState(item.totalFavorite);
  const { accessToken, user } = useContext(AuthContext) || {};
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/check-favorite/${item._id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsLiked(res.data);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkLikeStatus();
  }, [item._id]);

  const handleOnUserClick = () => {
    if (accessToken) {
      router.push(`/page/detail_user/${item?.userId?._id}`);
    } else {
      notification.error({
        message: "Please login to view user details",
        description: "Please try again later",
      });
    }
  };

  const handleTriggerWishListScore = async (musicId: string) => {
    const res = await sendRequest<IBackendRes<IVideo[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        userId: user._id,
        id: musicId,
        triggerAction: "ReactionAboutVideo",
      },
    });
  };

  const handleAddUserAction = async (musicId: string) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/action?action=reaction&id=${musicId}&`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error add action:", error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await handleLikeMusicAction(item._id);
      setIsLiked(!isLiked);
      setTotalFavorite(isLiked ? totalFavorite - 1 : totalFavorite + 1);
      await handleAddUserAction(item._id);
      await handleTriggerWishListScore(item._id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleNavigate = () => {
    router.back();
  };

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      setFlag(false)
      setTrackCurrent(track);
      localStorage.setItem("trackCurrent", JSON.stringify(track));

      return setIsPlaying(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleShareClick = async () => {

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/page/music/${item._id}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };


  return (
    <div className="relative h-[40vh] w-full shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-[#18192a] via-[#2d225a] to-[#3a2e5f]">
      {/* Back button */}
      {/* <div
        onClick={handleNavigate}
        className="absolute left-4 top-4 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-2 cursor-pointer shadow-md border border-white/30 z-10"
      >
        <IoMdArrowRoundBack color="#7c3aed" size={24} />
      </div> */}

      {/* Main content */}
      <div className="flex w-full h-full items-center justify-between px-12">
        {/* Thumbnail & Info */}
        <div className="flex items-center gap-8">
          <div className="shadow-xl rounded-xl overflow-hidden border-4 border-white/30">
            <Image
              alt="thumbnail"
              src={item.musicThumbnail}
              width={180}
              height={180}
              className="object-cover w-[180px] h-[180px] rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2 max-w-[60vw]">
            <div className="text-white text-5xl md:text-6xl font-extrabold font-roboto drop-shadow-lg truncate">
              {item.musicDescription}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {item.musicTag?.map((tag, index) => (
                <div key={index} className="flex items-center">
                  {index !== 0 && <LuDot size={28} className="text-white/70" />}
                  <span
                    onClick={() => router.push(`/page/detail_user/${tag._id}`)}
                    className="text-white/90 font-medium cursor-pointer hover:underline hover:text-[#a78bfa] transition-colors"
                  >
                    {tag?.fullname}
                  </span>
                </div>
              ))}
              <div className="flex items-center ml-2">
                <LuDot size={28} className="text-white/70" />
                <span className="text-white/80 font-semibold">{formatNumber(item.totalListener)}</span>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-6 mt-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition-all border-2 border-transparent ${isLiked ? 'bg-pink-100 text-pink-600' : 'bg-white/20 text-white hover:bg-white/40 hover:text-[#7c3aed]'}`}
                onClick={handleLike}
              >
                {isLiked ? (
                  <MdFavorite size={22} className="text-pink-500" />
                ) : (
                  <MdFavoriteBorder size={22} className="" />
                )}
                <span>{formatNumber(totalFavorite)}</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white font-semibold shadow border-2 border-transparent">
                <FaRegComment size={22} />
                <span>{formatNumber(item.totalComment)}</span>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white font-semibold shadow border-2 border-transparent hover:bg-white/40 hover:text-[#7c3aed] transition-all"
                onClick={handleShareClick}
              >
                <RiShareForwardLine size={22} />
                {copied && <span className="text-green-400 ml-1">Copied!</span>}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white font-semibold shadow border-2 border-transparent hover:bg-white/40 hover:text-[#7c3aed] transition-all"
                onClick={handleReport}
              >
                <BiFlag size={22} />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
        {/* Player */}
        <div className="flex items-center justify-center h-full">
          <ButtonPlayer
            className="w-20 h-20 shadow-2xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] rounded-full flex items-center justify-center"
            current={item._id}
            isPlaying={isPlaying}
            togglePlay={() => handlePlayer(item)}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ReportModal onClose={handleCloseModal} musicId={item._id} />
        </div>
      )}
    </div>
  );
};

export default DisplayMusicDetail;
