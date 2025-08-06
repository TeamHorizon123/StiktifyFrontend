"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchMyVideos } from "@/actions/videoPosted.video.action";
import { formatNumber } from "@/utils/utils";
import VideoCustomize from "@/components/video/video.customize";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Eye, MessageCircle, Heart, Trash2 } from "lucide-react";

// Định nghĩa interface cho video
interface IShortVideo {
  _id: string;
  videoThumbnail: string;
  videoUrl: string;
  totalViews?: number;
  totalReaction?: number;
  totalComment?: number;
  videoDescription?: string;
  isDelete?: boolean;
}

// Định nghĩa interface cho props của MyVideo
interface MyVideoProps {
  userId?: string;
  isOwner?: boolean;
}

const DELETED_VIDEOS_KEY = "deletedVideos";

const MyVideo = ({ userId }: MyVideoProps) => {
  const { user } = useContext(AuthContext) ?? {};
  // Ưu tiên prop userId, fallback context
  const currentUserId = userId || user?._id;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const userIdFromURL = pathname.split("/").pop();
  const queryUserId = searchParams.get("userId");
  const [videos, setVideos] = useState<IShortVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách video đã xóa từ localStorage
  const getDeletedVideoIds = (): string[] => {
    const stored = localStorage.getItem(DELETED_VIDEOS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Cập nhật danh sách video đã xóa vào localStorage
  const addDeletedVideoId = (id: string) => {
    const deletedIds = getDeletedVideoIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(DELETED_VIDEOS_KEY, JSON.stringify(deletedIds));
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await fetchMyVideos(currentUserId, 1, 30);
        if (response?.data?.result) {
          const fetchedVideos: IShortVideo[] = response.data.result;
          const deletedIds = getDeletedVideoIds();
          const updatedVideos = fetchedVideos.map((video) => ({
            ...video,
            isDelete: deletedIds.includes(video._id),
          }));
          setVideos(updatedVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
      setLoading(false);
    };

    loadVideos();
  }, [currentUserId]);

  // Hàm gọi API DELETE từ phía server
  const deleteVideoAPI = async (videoId: string, userId: string) => {
    try {
      const response = await sendRequest<{ data: any }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/${videoId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: { userId },
      });
      return response;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  };

  // Hàm xử lý khi nhấn nút Delete
  const handleDelete = async (videoId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (confirmed && user?._id) {
      try {
        await deleteVideoAPI(videoId, user._id);
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video._id === videoId ? { ...video, isDelete: true } : video
          )
        );
        addDeletedVideoId(videoId);
      } catch (error) {
        console.error("Error in handleDelete:", error);
      }
    }
  };

  // Lọc danh sách video hiển thị (ẩn video đã xóa)
  const visibleVideos = videos.filter((video) => !video.isDelete);

  return (
    <div className="p-0 bg-transparent">
      {loading ? (
        <p className="text-gray-300 text-center">Loading...</p>
      ) : visibleVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 py-6">
          {visibleVideos.map((video) => (
            <div
              key={video._id}
              className="relative bg-[#2d2250cc] rounded-2xl shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full">
                <VideoCustomize
                  videoThumbnail={video.videoThumbnail}
                  videoId={video._id}
                  // Có thể truyền thêm prop className nếu cần
                />
                {/* Overlay thông tin */}
                <span className="absolute bottom-2 right-3 text-xs text-white bg-black/40 px-2 py-0.5 rounded">
                  {video.videoDescription && video.videoDescription.length > 30
                    ? video.videoDescription.slice(0, 30) + "..."
                    : video.videoDescription || "No description"}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-white font-semibold text-base mb-1">
                    {video.videoDescription || "No description"}
                  </div>
                  <div className="flex items-center gap-4 text-purple-200 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye size={16} /> {formatNumber(video.totalViews ?? 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={16} />{" "}
                      {formatNumber(video.totalReaction ?? 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />{" "}
                      {formatNumber(video.totalComment ?? 0)}
                    </span>
                  </div>
                </div>
                {user?._id === currentUserId && (
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="absolute top-3 right-3  hover:bg-red-600 text-white p-2 rounded-full shadow transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-center">No videos found.</p>
      )}
    </div>
  );
};

export default MyVideo;
