import React, { useContext, useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { FaThumbsUp } from "react-icons/fa";

import like_gif from "@/assets/reaction/gif/thumb-up.gif";
import like_img from "@/assets/reaction/image/thumb-up.png";
import surprised_gif from "@/assets/reaction/gif/surprised.gif";
import surprised_img from "@/assets/reaction/image/surprised.png";
import angry_gif from "@/assets/reaction/gif/angry.gif";
import angry_img from "@/assets/reaction/image/angry.png";
import happy_gif from "@/assets/reaction/gif/happy.gif";
import happy_img from "@/assets/reaction/image/happy.png";
import in_love_gif from "@/assets/reaction/gif/in-love.gif";
import in_love_img from "@/assets/reaction/image/in-love.png";
import sad_gif from "@/assets/reaction/gif/sad.gif";
import sad_img from "@/assets/reaction/image/sad.png";

import Image from "next/image";

interface Reaction {
  _id: string;
  icon: JSX.Element;
  type?: string;
}

interface ReactionSectionProp {
  videoId: string | undefined;
  onReactionAdded: () => void;
  onReactionRemove: () => void;
  numberReaction: string;
}

const lastReactions: Reaction[] = [
  {
    _id: "6741b8a5342097607f012a76",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={like_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a77",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={in_love_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7b",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={happy_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a78",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={surprised_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a79",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={sad_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7a",
    icon: (
      <div className="relative w-4 h-4">
        <Image
          src={angry_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
];

const reactions: Reaction[] = [
  {
    _id: "6741b8a5342097607f012a76",
    type: "Like",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={like_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={like_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 h-100 w-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a77",
    type: "Love",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={in_love_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={in_love_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7b",
    type: "Haha",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={happy_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={happy_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a78",
    type: "Wow",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={surprised_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={surprised_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a79",
    type: "Sad",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={sad_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={sad_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7a",
    type: "Angry",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={angry_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={angry_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
];

const ReactSection: React.FC<ReactionSectionProp> = ({
  videoId,
  onReactionAdded,
  onReactionRemove,
  numberReaction,
}) => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null
  );
  const [showReactions, setShowReactions] = useState(false);
  const [loading, setLoading] = useState(true);

  const [thisReactions, setThisReactions] = useState<Reaction[]>([]);
  const [thisFirstReactions, setFirstThisReactions] = useState<Reaction[]>([]);
  useEffect(() => {
    if (!videoId) return;

    const fetchReactions = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/${videoId}/reactions`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.statusCode === 200) {
          // Lọc các reaction có trong dữ liệu trả về
          const fetchedReactions = lastReactions.filter((reaction) =>
            res.data.includes(reaction._id)
          );
          setThisReactions(fetchedReactions);
          setFirstThisReactions(fetchedReactions);
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [videoId]);

  useEffect(() => {
    setSelectedReaction(null);
    setLoading(true);
  }, [videoId]);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (!videoId || !accessToken) return;

      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/getReactByUser`,
          method: "POST",
          body: { videoId },
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res && res?.data?.reactionTypeId) {
          const foundReaction = reactions.find(
            (r) => r._id === res?.data?.reactionTypeId
          );
          if (foundReaction) setSelectedReaction(foundReaction);
        }
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái reaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReaction();
  }, [videoId, accessToken]);

  const handleTriggerWishListScore = async (videoId: string) => {
    const res = await sendRequest<IBackendRes<IVideo[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        userId: user._id,
        id: videoId,
        triggerAction: "ReactionAboutVideo",
      },
    });
  };

  const handleAddUserAction = async (videoId: string) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/action?action=reaction&id=${videoId}&`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error add reaction:", error);
    }
  };

  const handleAddReaction = async (reaction: Reaction) => {
    if (!videoId || !accessToken) return;
    const oldSelectedReaction = selectedReaction;
    // Tìm reaction trong lastReactions

    setSelectedReaction(reaction);
    setShowReactions(false);

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/react`,
        method: "POST",
        body: { videoId, reactionTypeId: reaction._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      oldSelectedReaction! ? "" : onReactionAdded();
      const reactionToAdd = lastReactions.find((r) => r._id === reaction._id);

      if (reactionToAdd) {
        setThisReactions((prevReactions) => {
          // Kiểm tra xem oldSelectedReaction có trong thisReactions nhưng không có trong thisFirstReactions không
          const isInThisReactions = prevReactions.some(
            (r) => r._id === oldSelectedReaction!?._id
          );
          const isNotInFirstReactions = !thisFirstReactions.some(
            (r) => r._id === oldSelectedReaction!?._id
          );
          console.log("CHECK >>>: ", isInThisReactions, isNotInFirstReactions);

          // Nếu thỏa điều kiện, mới xóa nó khỏi mảng
          if (isInThisReactions && isNotInFirstReactions) {
            return prevReactions.filter((r) => r._id !== selectedReaction!._id);
          }

          // Nếu không thỏa điều kiện, giữ nguyên mảng
          return prevReactions;
        });
        // Thêm reaction vào mảng thisReactions nếu chưa tồn tại
        setThisReactions((prevReactions) => {
          const isReactionExists = prevReactions.some(
            (r) => r._id === reactionToAdd._id
          );
          if (!isReactionExists) {
            return [...prevReactions, reactionToAdd];
          }
          return prevReactions;
        });
      }
      await handleAddUserAction(videoId);
      await handleTriggerWishListScore(videoId);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleRemoveReaction = async () => {
    if (!videoId || !accessToken) return;

    // Xóa reaction khỏi mảng thisReactions
    setThisReactions((prevReactions) =>
      prevReactions.filter((r) => r._id !== selectedReaction!._id)
    );

    setSelectedReaction(null);
    setShowReactions(false);
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/unreact`,
        method: "POST",
        body: { videoId },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onReactionRemove();
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  return (
    <div className="relative inline-block align-middle">
      {loading ? (
        <FaThumbsUp className="text-gray-400" size={22} />
      ) : (
        <>
          {showReactions && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border p-1 rounded-md shadow-md flex gap-1"
              style={{ minWidth: 0, whiteSpace: "nowrap" }}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {reactions.map((reaction) => (
                <button
                  key={reaction._id}
                  className="p-1 flex items-center justify-center bg-transparent border-none outline-none"
                  style={{ width: 32, height: 32 }}
                  onClick={() => handleAddReaction(reaction)}
                  tabIndex={-1}
                  type="button"
                >
                  {reaction.icon}
                </button>
              ))}
            </div>
          )}
          <div
            className="cursor-pointer flex items-center gap-2"
            style={{ minHeight: 32 }}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {selectedReaction ? (
              <div
                onClick={handleRemoveReaction}
                className="flex items-center gap-1"
                style={{ minHeight: 32 }}
                title={`Remove ${selectedReaction.type}`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {selectedReaction.icon}
                </span>
                <span className="text-base font-medium">
                  {selectedReaction.type}
                </span>
              </div>
            ) : (
              <span className="w-6 h-6 flex items-center justify-center">
                <FaThumbsUp className="text-gray-400" size={22} />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReactSection;
