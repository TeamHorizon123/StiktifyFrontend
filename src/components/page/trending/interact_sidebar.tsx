"use client";

import { useRouter } from "next/navigation";
import ReactSection from "./react_section";
import { CheckOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { getAllFollowing, handleFollow } from "@/actions/manage.follow.action";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";
import ReportModal from "@/components/page/trending/report_video";

import TickedUser from "@/components/ticked-user/TickedUser";
import { Flag, Heart, MessageCircle, Share2 } from "lucide-react";
import TagMusic from "@/components/music/tag.music";

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
  videoDescription?: string;
  totalViews?: number;
  createdAt?: string;
  videoTags?: string[];
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
  videoDescription,
  totalViews,
  createdAt,
  videoTags,
}) => {
  const router = useRouter();
  const { user, listFollow, accessToken } = useContext(AuthContext) ?? {};
  const [dataFollow, setDataFollow] = useState<string[]>([]);
  const [flag, setFlag] = useState(false);
  const isFollowing = dataFollow?.includes(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);

  const handleReport = () => {
    if (!user || !user._id) {
      return notification.error({ message: "Please log in first" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileClick = () => {

    if (accessToken) {
      router.push(`/page/detail_user/${userId}`);
    } else {
      notification.error({
        message: "Please login to view user details",
        description: "Please try again later",
      });
    }
  };

  const handleShareClick = async () => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/page/trending?id=${videoId}`;
    console.log(link);

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notification.success({ message: "Link copied to clipboard!" });
    } catch (err) {
      console.error("Failed to copy: ", err);
      notification.error({ message: "Failed to copy link" });
    }
  };

  // const handleCommentClick = () => {
  //   if (!user || !user._id) {
  //     return notification.error({
  //       message: "Please log in first",
  //       description: "You need to be logged in to comment on videos.",
  //     });
  //   }
  //   onCommentClick?.();
  // };

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
  useEffect(() => {
    if (currentVideo) {
      setCurrentMusic(currentVideo?.musicId || null);
    }
  }, [currentVideo]);
  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };

  return (
    <div className="w-full px-0 pt-0">
      <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4 mb-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-400">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <UserOutlined className="text-3xl text-gray-500 w-full h-full flex items-center justify-center" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-white font-bold text-lg truncate cursor-pointer hover:text-purple-300 transition-colors"
            onClick={handleProfileClick}
          >
            {creatorId || "Unknown"}
          </div>
          <div
            className="text-purple-200 text-sm truncate cursor-pointer hover:text-purple-100 transition-colors"
            onClick={handleProfileClick}
          >
            @{userId?.slice(0, 8) || "unknown"}
          </div>
        </div>
        <button
          onClick={handleFollower}
          className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all duration-200 ${isFollowing
              ? "bg-gray-500 hover:bg-gray-600 hover:scale-105"
              : "bg-red-500 hover:bg-red-600 hover:scale-105"
            } text-white shadow-lg hover:shadow-xl`}
        >
          {isFollowing ? <CheckOutlined /> : <PlusOutlined />}
        </button>
      </div>

      {/* Video Description Section */}
      {videoDescription && (
        <div className="mb-4 rounded-xl bg-white/10 backdrop-blur-sm text-white p-4 shadow-lg">
          <div className="font-bold mb-3 line-clamp-3">{videoDescription}</div>
          {(totalViews || createdAt) && (
            <div className="flex items-center gap-4 text-gray-300 mb-2 text-sm">
              {totalViews && (
                <span>
                  <svg
                    className="inline w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
                      stroke="#aaa"
                    />
                    <path d="M12 7V13L16 15" stroke="#aaa" />
                  </svg>
                  {totalViews} views
                </span>
              )}
              {createdAt && (
                <span>
                  <svg
                    className="inline w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="#aaa"
                    />
                    <path d="M8 2V6" stroke="#aaa" />
                    <path d="M16 2V6" stroke="#aaa" />
                  </svg>
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
          {videoTags && videoTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {videoTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-800/80 text-xs px-3 py-1 rounded-full font-semibold hover:bg-purple-700/80 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-3 py-3 text-base rounded-lg transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-purple-500/50">
          {onReactionAdded && onReactionRemove ? (
            <ReactSection
              videoId={videoId}
              onReactionAdded={onReactionAdded}
              onReactionRemove={onReactionRemove}
              numberReaction={numberReaction}
            />
          ) : (
            <>
              <span className="w-6 h-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z" />
                </svg>
              </span>
              <span>{numberReaction || 0} Reaction</span>
            </>
          )}
        </div>

        <button
          className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-3 py-3 justify-start text-base rounded-lg transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-purple-500/50 hover:scale-[1.02]"
          onClick={onCommentClick}
          style={{ outline: "none", border: "2px solid transparent" }}
        >
          <MessageCircle className="h-6 w-6" />
          <span>{numberComment || 0} Comment</span>
        </button>

        <button
          className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-3 py-3 justify-start text-base rounded-lg transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-purple-500/50 hover:scale-[1.02]"
          onClick={handleShareClick}
          style={{ outline: "none", border: "2px solid transparent" }}
        >
          <Share2 className="h-6 w-6" />
          <span>Share</span>
        </button>

        <button
          className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-3 py-3 justify-start text-base rounded-lg transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-purple-500/50 hover:scale-[1.02]"
          onClick={handleReport}
          style={{ outline: "none", border: "2px solid transparent" }}
        >
          <Flag className="h-6 w-6" />
          <span>Report</span>
        </button>

        {copied && (
          <div className="text-green-400 text-sm mt-2 px-3 py-2 bg-green-400/10 rounded-lg border border-green-400/20">
            ✓ Copied Link Successfully
          </div>
        )}
      </div>

      {isModalOpen && (
        <ReportModal onClose={handleCloseModal} videoId={videoId} />
      )}
      <div>
        {currentMusic && (
          <div className="fixed bottom-4 left-4 w-80 h-20 bg-black/80 backdrop-blur-md rounded-xl flex px-3 border border-white/10 z-10">
            <TagMusic onClick={handleNavigate} item={currentMusic} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractSideBar;
