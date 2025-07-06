"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchMyVideos } from "@/actions/videoPosted.video.action";
import { formatNumber } from "@/utils/utils";
import VideoCustomize from "@/components/video/video.customize";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

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

const DELETED_VIDEOS_KEY = "deletedVideos";

const MyVideo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const userIdFromURL = pathname.split("/").pop();
  const queryUserId = searchParams.get("userId");
  const currentUserId = userIdFromURL || queryUserId || user?._id;
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
    <div className="p-6 bg-white shadow-md rounded-lg mb-40 mt-[-22px]">
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : visibleVideos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Thumbnail</th>
                <th className="border px-4 py-2 text-left">Views</th>
                <th className="border px-4 py-2 text-left">Reactions</th>
                <th className="border px-4 py-2 text-left">Comments</th>
                <th className="border px-4 py-2 text-left">Description</th>
                {user?._id === currentUserId && (
                  <th className="border px-4 py-2 text-left">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleVideos.map((video) => (
                <tr key={video._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <VideoCustomize
                      videoThumbnail={video.videoThumbnail}
                      videoId={video._id}
                    />
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalViews ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalReaction ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalComment ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {video.videoDescription || "No description"}
                  </td>
                  {user?._id === currentUserId && (
                    <td className="border px-4 py-2 text-gray-700">
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No videos found.</p>
      )}
    </div>
  );
};

export default MyVideo;
