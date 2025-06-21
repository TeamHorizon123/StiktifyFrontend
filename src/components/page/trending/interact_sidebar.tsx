"use client";

import { useRouter } from "next/navigation";
import ReactSection from "./react_section";
import { CheckOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { getAllFollowing, handleFollow } from "@/actions/manage.follow.action";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";
import ReportModal from "@/components/page/trending/report_video";
import { motion } from "framer-motion";

import TickedUser from "@/components/ticked-user/TickedUser";

interface InteractSideBarProps {
  userId: string;
  creatorId: string;
  avatarUrl?: string;
  videoId: string | undefined;
  onCommentClick?: () => void;
  numberComment: any;
  numberReaction: any;
  onReactionAdded?: () => void;
  onReactionRemove?: () => void;
  isHidden?: Boolean;
}

const InteractSideBar: React.FC<InteractSideBarProps> = ({
  creatorId,
  onCommentClick,
  videoId,
  numberComment,
  userId,
  avatarUrl,
  numberReaction,
  onReactionAdded,
  onReactionRemove,
  isHidden,
}) => {
  const router = useRouter();
  const { user, listFollow } = useContext(AuthContext) ?? {};
  const [dataFollow, setDataFollow] = useState<string[]>([]);
  const [flag, setFlag] = useState(false);
  const isFollowing = dataFollow?.includes(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReport = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleProfileClick = () => {
    router.push(`/page/detail_user/${userId}`);
  };
  const handleShareClick = () => {
    router.push(`/page/share/${videoId}`);
  };

  useEffect(() => {
    if (!user || !user._id) return;
    (async () => {
      try {
        const res = await getAllFollowing(user._id);
        if (res?.statusCode === 200) {
          setDataFollow(res.data!);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    })();
  }, [user, flag]);

  useEffect(() => {
    setDataFollow(listFollow || []);
  }, [listFollow, user]);

  const handleFollower = async () => {
    if (!user || !user._id) {
      return notification.error({ message: "Please log in first" });
    }
    try {
      const res = await handleFollow(user._id, userId);
      if (res?.statusCode === 201) {
        setFlag(!flag);
        return notification.success({ message: "Successfully" });
      }
      notification.error({ message: "Follow failed" });
    } catch (error) {
      console.error("Error following user:", error);
      notification.error({ message: "An error occurred" });
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: !isHidden ? "0%" : "100%", opacity: !isHidden ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`w-[15%] bg-white shadow-lg absolute right-0 top-[95px] pt-10 pl-10 h-3/4 ${
        isHidden ? "hidden" : ""
      }`}
    >
      <nav>
        <ul className="space-y-10">
          <li
            className="flex items-center relative"
            onClick={handleProfileClick}
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-white shadow-md hover:opacity-80 transition-all flex items-center justify-center bg-gray-200">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-30 h-full object-cover"
                />
              ) : (
                <UserOutlined className="text-3xl text-gray-500" />
              )}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleFollower();
              }}
              className={`absolute -left-1 -bottom-1 w-6 h-6 flex items-center justify-center rounded-full shadow-md ${
                isFollowing
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {isFollowing ? (
                <CheckOutlined className="text-md" />
              ) : (
                <PlusOutlined className="text-md" />
              )}
            </div>
            <span
              className="ml-4 cursor-pointer text-lg font-medium hover:underline hover:text-blue-500 transition"
              onClick={() => router.push(`/page/detail_user/${userId}`)}
            >
              {creatorId} <TickedUser userId={userId} />
            </span>
          </li>

          <li>
            {onReactionAdded && onReactionRemove ? (
              <>
                <ReactSection
                  videoId={videoId}
                  onReactionAdded={onReactionAdded}
                  onReactionRemove={onReactionRemove}
                  numberReaction={numberReaction}
                />
              </>
            ) : (
              <div>
                <div className="text-xl cursor-pointer mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 512 512"
                  >
                    <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z" />
                  </svg>
                </div>
                {/* <div className="flex items-center mt-3">
                  <div className="flex items-center mr-2">
                    {thisReactions.map((reaction) => (
                      <div key={reaction._id} className="ml-1">
                        {reaction.icon}
                      </div>
                    ))}
                  </div>
                  {numberReaction}
                </div> */}
              </div>
            )}
          </li>
          <li className="flex items-center !mt-4">
            <div
              className="text-xl cursor-pointer mr-2"
              onClick={onCommentClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 576 512"
              >
                <path d="M532 386.2c27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.3 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.2 2.1 18.7 3.7 28.4 4.9C208.1 407.6 281.8 448 368 448c20.8 0 40.8-2.4 59.8-6.8C456.3 459.7 499.4 480 553 480c9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25-.4-.3-22.5-24.1-37.8-54.8zm-392.8-92.3L122.1 305c-14.1 9.1-28.5 16.3-43.1 21.4 2.7-4.7 5.4-9.7 8-14.8l15.5-31.1L77.7 256C64.2 242.6 48 220.7 48 192c0-60.7 73.3-112 160-112s160 51.3 160 112-73.3 112-160 112c-16.5 0-33-1.9-49-5.6l-19.8-4.5zM498.3 352l-24.7 24.4 15.5 31.1c2.6 5.1 5.3 10.1 8 14.8-14.6-5.1-29-12.3-43.1-21.4l-17.1-11.1-19.9 4.6c-16 3.7-32.5 5.6-49 5.6-54 0-102.2-20.1-131.3-49.7C338 339.5 416 272.9 416 192c0-3.4-.4-6.7-.7-10C479.7 196.5 528 238.8 528 288c0 28.7-16.2 50.6-29.7 64z" />
              </svg>
            </div>
            <p>{numberComment} Comment</p>
          </li>
          <li className="flex items-center">
            <div className="text-xl cursor-pointer mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 576 512"
                onClick={handleShareClick}
              >
                <path d="M561.9 158.1L417.9 14.1C387.9-15.9 336 5.1 336 48v57.2c-42.5 1.9-84 6.6-120.8 18-35.2 11-63.1 27.6-82.9 49.4C108.2 199.2 96 232.6 96 271.9c0 61.7 33.2 112.5 84.9 144.8 37.5 23.5 85.2-12.7 71-55.7-15.5-47.1-17.2-70.9 84.1-78.8V336c0 43 52 63.9 81.9 33.9l144-144c18.8-18.7 18.8-49.1 0-67.9zM384 336V232.2C255.3 234.1 166.5 255.4 206.3 376 176.8 357.6 144 324.1 144 271.9c0-109.3 129.1-118.9 240-119.9V48l144 144-144 144zm24.7 84.5a82.7 82.7 0 0 0 21-9.3c8-5 18.3 .8 18.3 10.2V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h132c6.6 0 12 5.4 12 12v4.5c0 4.9-3 9.4-7.6 11.2-13.7 5.3-26.4 11.5-38.1 18.6a12.1 12.1 0 0 1 -6.3 1.8H54a6 6 0 0 0 -6 6v340a6 6 0 0 0 6 6h340a6 6 0 0 0 6-6v-26c0-5.4 3.6-10.1 8.7-11.5z" />
              </svg>
            </div>
            Share
          </li>
          <li className="flex items-center">
            <div
              className="text-xl cursor-pointer mr-2 hover:text-red-500 transition"
              onClick={handleReport}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 512 512"
              >
                <path d="M64 32c0-17.7 14.3-32 32-32h352c17.7 0 32 14.3 32 32v352c0 17.7-14.3 32-32 32H96v64H64V32zm32 32v320h320V64H96z" />
                <path d="M128 128h256v64H128v-64zm0 96h192v64H128v-64z" />
              </svg>
            </div>
            <span
              className="cursor-pointer text-lg font-medium hover:underline hover:text-red-500 transition"
              onClick={handleReport}
            >
              Report
            </span>
          </li>
          {isModalOpen && (
            <ReportModal onClose={handleCloseModal} videoId={videoId} />
          )}
        </ul>
      </nav>
    </motion.div>
  );
};
export default InteractSideBar;
