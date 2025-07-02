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
    <div className="h-[40vh] w-full bg-gray-900 rounded-sm shadow-gray-400/50 flex items-center px-16 relative">
      <div
        onClick={handleNavigate}
        className="absolute left-2 top-3 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer"
      >
        <IoMdArrowRoundBack color="white" className="m-2" size={20} />
      </div>
      <div className="flex w-full justify-between items-end">
        <div className="flex gap-5 items-center justify-around">
          <Image
            alt="thumbnail"
            src={item.musicThumbnail}
            width={200}
            height={100}
            className="rounded-md"
          />
          <div>
            <div className="text-white text-[80px] font-roboto font-bold truncate w-[70vw]">
              {item.musicDescription}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                {item.musicTag?.map((tag, index) => (
                  <div key={index} className="text-white flex items-center">
                    {index !== 0 && <LuDot size={40} />}
                    <div
                      onClick={() =>
                        router.push(`/page/detail_user/${tag._id}`)
                      }
                      className="relative group"
                    >
                      <span className="cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                        {tag?.fullname}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-white flex items-center">
                  <LuDot size={40} />
                  <span>{formatNumber(item.totalListener)}</span>
                </div>
              </div>
              <div className="flex gap-5">
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleLike}
                >
                  {isLiked ? (
                    <MdFavorite size={20} className="text-red-500" /> // Icon like (đã like)
                  ) : (
                    <MdFavoriteBorder size={20} className="text-gray-400" /> // Icon like (chưa like)
                  )}
                  <span className="text-gray-400">
                    {formatNumber(totalFavorite)}
                  </span>
                </div>
                <div className="flex gap-2 items-center cursor-pointer">
                  <FaRegComment size={20} className="text-gray-400" />
                  <span className="text-gray-400">
                    {formatNumber(item.totalComment)}
                  </span>
                </div>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleShareClick}
                >
                  <RiShareForwardLine size={20} className="text-gray-400" />
                  {/* <span className="text-gray-400">
                    {formatNumber(item.totalShare)}
                  </span> */}
                  {copied && <div style={{ color: 'green', marginTop: '8px' }}>Copied Link Successfully</div>}

                </div>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleReport}
                >
                  <BiFlag size={20} className="text-gray-400" />
                  <span className="text-gray-400">Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ButtonPlayer
            className="w-16 h-16"
            current={item._id}
            isPlaying={isPlaying}
            togglePlay={() => handlePlayer(item)}
          />
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ReportModal onClose={handleCloseModal} musicId={item._id} />
        </div>
      )}
    </div>
  );
};

export default DisplayMusicDetail;
