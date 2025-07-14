import React, { useContext, useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

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
      <div className="relative w-5 h-5">
        <Image
          src={like_img}
          alt="Like"
          width={20}
          height={20}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a77",
    icon: (
      <div className="relative w-5 h-5">
        <Image
          src={in_love_img}
          alt="Love"
          width={20}
          height={20}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7b",
    icon: (
      <div className="relative w-5 h-5">
        <Image
          src={happy_img}
          alt="Haha"
          width={20}
          height={20}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a78",
    icon: (
      <div className="relative w-5 h-5">
        <Image
          src={surprised_img}
          alt="Wow"
          width={20}
          height={20}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a79",
    icon: (
      <div className="relative w-5 h-5">
        <Image
          src={sad_img}
          alt="Sad"
          width={20}
          height={20}
          className="absolute inset-0 transition-opacity duration-300"
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7a",
    icon: (
      <div className="relative w-5 h-5">
        <Image
          src={angry_img}
          alt="Angry"
          width={20}
          height={20}
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
          alt="Like"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={like_gif}
          alt="Like GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
          alt="Love"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={in_love_gif}
          alt="Love GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
          alt="Haha"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={happy_gif}
          alt="Haha GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
          alt="Wow"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={surprised_gif}
          alt="Wow GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
          alt="Sad"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={sad_gif}
          alt="Sad GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
          alt="Angry"
          width={32}
          height={32}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          unoptimized
          src={angry_gif}
          alt="Angry GIF"
          width={32}
          height={32}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
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
  const [topReactions, setTopReactions] = useState<
    { reaction: Reaction; count: number }[]
  >([]);
  useEffect(() => {
    if (!videoId) return;

    const fetchReactions = async () => {
    if (!user || !user._id) {
      return
    }
      try {
        const res = await sendRequest<{
          statusCode: number;
          data: string[];
          reactionCounts?: Record<string, number>;
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/${videoId}/reactions`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.statusCode === 200) {
          // Get top 3 reactions count
          if (res.reactionCounts) {
            const topReactionsData = Object.entries(res.reactionCounts)
              .map(([reactionId, count]) => {
                const foundReaction = lastReactions.find(
                  (r) => r._id === reactionId
                );
                return foundReaction
                  ? { reaction: foundReaction, count: count }
                  : null;
              })
              .filter(
                (item): item is { reaction: Reaction; count: number } =>
                  item !== null
              )
              .sort((a, b) => b.count - a.count)
              .slice(0, 3);

            setTopReactions(topReactionsData);
          }
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [videoId, accessToken]);

  useEffect(() => {
    setSelectedReaction(null);
    setLoading(true);
  }, [videoId]);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (!videoId || !accessToken) return;

      try {
        const res = await sendRequest<IBackendRes<{ reactionTypeId?: string }>>(
          {
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/getReactByUser`,
            method: "POST",
            body: { videoId },
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res && res?.data?.reactionTypeId) {
          const foundReaction = reactions.find(
            (r) => r._id === res?.data?.reactionTypeId
          );
          if (foundReaction) setSelectedReaction(foundReaction);
        }
      } catch (error) {
        console.error("Error getting reaction status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReaction();
  }, [videoId, accessToken]);

  const handleTriggerWishListScore = async (videoId: string) => {
      if (!user || !user._id) {
      return 
    }
    await sendRequest<IBackendRes<IVideo[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        userId: user?._id,
        id: videoId,
        triggerAction: "ReactionAboutVideo",
      },
    });
  };

  const handleAddUserAction = async (videoId: string) => {
    if (!user || !user._id) {
      return 
    }
    try {
      await sendRequest<IBackendRes<{ success: boolean }>>({
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

    setSelectedReaction(reaction);
    setShowReactions(false);

    try {
      await sendRequest<IBackendRes<{ success: boolean }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/react`,
        method: "POST",
        body: { videoId, reactionTypeId: reaction._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Only call onReactionAdded if there was no previous reaction
      if (!oldSelectedReaction) {
        onReactionAdded();
      }

      // Update the top reactions - we'll refetch them in a real application
      // but for now we can just simulate updating the top reactions list
      setTopReactions((prev) => {
        // Try to find if this reaction already exists in our top list
        const existingIndex = prev.findIndex(
          (item) => item.reaction._id === reaction._id
        );

        if (existingIndex >= 0) {
          // Increase count of existing reaction
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            count: updated[existingIndex].count + 1,
          };
          return updated.sort((a, b) => b.count - a.count);
        } else {
          // Add new reaction with count 1
          const foundReaction = lastReactions.find(
            (r) => r._id === reaction._id
          );
          if (foundReaction) {
            const updated = [...prev, { reaction: foundReaction, count: 1 }];
            return updated.sort((a, b) => b.count - a.count).slice(0, 3);
          }
        }
        return prev;
      });

      await handleAddUserAction(videoId);
      await handleTriggerWishListScore(videoId);
    } catch (error) {
      console.error("Error updating reaction:", error);
      // Restore old state if there was an error
      setSelectedReaction(oldSelectedReaction);
    }
  };

  const handleRemoveReaction = async () => {
    if (!videoId || !accessToken || !selectedReaction) return;

    const reactionToRemove = selectedReaction;
    setSelectedReaction(null);
    setShowReactions(false);

    // Update the top reactions list
    setTopReactions((prev) => {
      return prev
        .map((item) => {
          if (item.reaction._id === reactionToRemove._id && item.count > 1) {
            return { ...item, count: item.count - 1 };
          }
          return item;
        })
        .sort((a, b) => b.count - a.count);
    });

    try {
      await sendRequest<IBackendRes<{ success: boolean }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/unreact`,
        method: "POST",
        body: { videoId },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onReactionRemove();
    } catch (error) {
      console.error("Error updating reaction:", error);
      // Restore state if there was an error
      setSelectedReaction(reactionToRemove);
    }
  };

  return (
    <div className="flex items-center">
      {loading ? (
        <div className="flex items-center">
          <FaThumbsUp className="text-gray-400 mr-2" size={20} />
          <span className="text-white">{numberReaction || 0} Reaction</span>
        </div>
      ) : (
        <>
          <div className="relative">
            {showReactions && (
              <div
                className="absolute bottom-4 left-0 mb-2 bg-white border p-2 rounded-lg shadow-lg flex gap-2 z-50"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactions.map((reaction) => (
                  <div
                    key={reaction._id}
                    className="cursor-pointer p-1 hover:scale-110 transition-transform"
                    onClick={() => handleAddReaction(reaction)}
                  >
                    {reaction.icon}
                  </div>
                ))}
              </div>
            )}
            <div
              className="cursor-pointer flex items-center justify-center"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              onClick={selectedReaction ? handleRemoveReaction : undefined}
            >
              {selectedReaction ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2">{selectedReaction.icon}</div>
                  <span className="text-white text-base">
                    {numberReaction || 0} Reaction
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">
                    <FaRegThumbsUp
                      className="text-gray-400"
                      size={20}
                      color="#f3f3f3"
                    />
                  </div>
                  <span className="text-white text-base">
                    {numberReaction || 0} Reaction
                  </span>
                </div>
              )}
            </div>
          </div>

          {topReactions.length > 0 && (
            <div className="flex items-center ml-2">
              <div className="flex items-center">
                {topReactions.map((item, index) => (
                  <div
                    key={item.reaction._id}
                    className={`${index > 0 ? "-ml-1" : ""} w-5 h-5`}
                    title={`${item.reaction.type || "Reaction"}: ${item.count}`}
                  >
                    {item.reaction.icon}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReactSection;
