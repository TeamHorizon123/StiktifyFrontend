"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaLock, FaUnlock } from "react-icons/fa"; // Biểu tượng ổ khóa
import { Skeleton } from "antd";

interface LikedVideoReaction {
  videoId: string;
}

interface ShortVideo {
  _id: string;
  videoURL: string;
  videoDescription: string;
  videoTag: string;
  totalViews: number;
  totalReaction: number;
}

interface LikedVideoProps {
  userId?: string;
}

const LikedVideo = ({ userId }: LikedVideoProps) => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const targetId = userId || user?._id;
  const isOwner = user && user._id && user._id === targetId;
  const [likedVideos, setLikedVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [areVideosHidden, setAreVideosHidden] = useState<boolean>(() => {
    // Lưu trạng thái vào localStorage theo user
    if (typeof window !== "undefined") {
      return localStorage.getItem(`likedVideoHidden_${targetId}`) === "true";
    }
    return false;
  });

  const router = useRouter();

  useEffect(() => {
    if (targetId && accessToken) {
      fetchLikedVideos();
    }
  }, [targetId, accessToken]);

  const fetchLikedVideos = async () => {
    try {
      const res = await sendRequest<{ data: LikedVideoReaction[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/user/${targetId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const reactions = res.data || [];
      console.log("Res:>>>>>>>>>: ", res.data);
      const videos: ShortVideo[] = await Promise.all(
        reactions.map(async (reaction) => {
          const videoRes = await sendRequest<{ data: ShortVideo }>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/${reaction.videoId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return videoRes.data;
        })
      );

      setLikedVideos(videos);
    } catch (err) {
      setError("Failed to fetch liked videos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAllVideos = () => {
    setAreVideosHidden((prev) => {
      localStorage.setItem(`likedVideoHidden_${targetId}`, (!prev).toString());
      return !prev;
    });
  };

  return (
    <div className="p-6 mb-40 mt-[-22px]">
      <div className="flex justify-between items-center mb-4 mx-20">
        {isOwner && (
          <button
            onClick={toggleAllVideos}
            className="text-gray-600 hover:text-gray-800"
            title={areVideosHidden ? "Show all videos" : "Hide all videos"}
          >
            {areVideosHidden ? (
              <div className="flex items-center gap-2">
                <FaLock className="text-purple-500" size={20} />
                <span className="text-purple-500"> Private videos</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaUnlock className="text-purple-500" size={20} />
                <span className="text-purple-500"> Public videos</span>
              </div>
            )}
          </button>
        )}
      </div>
      {loading ? (
        /* 4 skeleton cards giả */
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              active
              avatar={{ shape: "square", size: 160 }}
              paragraph={{ rows: 2 }}
            />
          ))}
        </div>
      ) : areVideosHidden && !isOwner ? (
        <p className="text-gray-500 text-center w-full">
          This is user privacy.
        </p>
      ) : error ? (
        <p className="text-red-600 text-center w-full">{error}</p>
      ) : likedVideos.length > 0 ? (
        <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
          {likedVideos.map((video) => (
            <div
              key={video._id}
              className="p-2 border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full sm:w-1/2 md:w-1/4"
              onClick={() => router.push(`/page/trending?id=${video._id}`)}
            >
              <video controls className="w-full h-40 object-cover rounded">
                <source src={video.videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="mt-2">
                <p className="text-gray-800 font-medium text-sm line-clamp-2">
                  {video.videoDescription}
                </p>
                <p className="text-gray-600 text-xs">
                  Views: {video.totalViews} - Reactions: {video.totalReaction}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.isArray(video.videoTag) ? (
                    video.videoTag.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      #{video.videoTag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center w-full">
          No liked videos found.
        </p>
      )}
    </div>
  );
};

export default LikedVideo;
