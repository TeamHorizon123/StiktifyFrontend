"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { formatNumber } from "@/utils/utils";

interface LikedVideoReaction {
  videoId: string;
}

interface ShortVideo {
  _id: string;
  videoURL: string;
  videoThumbnail: string;
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
  const [likedVideos, setLikedVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="p-6 mb-40 mt-[-22px]">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#23243a] rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-gray-600"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-400 text-center w-full text-lg">{error}</p>
      ) : likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-3 mx-2">
          {likedVideos.map((video) => (
            <div key={video._id} className="flex justify-center items-stretch">
              <div className="w-full max-w-[280px]">
                <div
                  className="bg-[#23243a] rounded-xl overflow-hidden hover:bg-[#2a2b4a] transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
                  onClick={() => router.push(`/page/trending?id=${video._id}`)}
                >
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    <img
                      src={video.videoThumbnail}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Stats overlay - chỉ hiển thị views */}
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-black/50 px-2 py-1 rounded">
                        View:  {formatNumber(video.totalViews)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-white font-medium text-sm line-clamp-2 mb-2 leading-tight">
                      {video.videoDescription}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(video.videoTag) ? (
                        video.videoTag
                        // .slice(0, 2)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                          #{video.videoTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg font-medium">
            No liked videos found
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
