import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

interface OtherVideosProps {
  isVisible: boolean;
  videoData: IVideo[];
  currentVideoIndex: number;
  setCurrentVideoIndex: Dispatch<SetStateAction<number>>;
  setCurrentVideo: Dispatch<SetStateAction<IVideo | null>>;
  setIsShowOtherVideos: Dispatch<SetStateAction<boolean>>;
  setVideoData: Dispatch<SetStateAction<IVideo[]>>; // Thêm prop này
}

const OtherVideos: React.FC<OtherVideosProps> = ({
  videoData,
  currentVideoIndex,
  setCurrentVideoIndex,
  setCurrentVideo,
  setIsShowOtherVideos,
  setVideoData,
}) => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const handleChooseVideo = (index: number) => {
    setCurrentVideo(videoData[index]);
    setCurrentVideoIndex(index);
    setIsShowOtherVideos(false);
  };

  const loadMoreVideos = async () => {
    if (loading || !hasMore || !accessToken) return;
    setLoading(true);
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-user-videos`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user?._id,
          page: page + 1,
          limit: 10,
        },
      });

      if (res?.data && res.data.length > 0) {
        setVideoData((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more videos:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll event
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Nếu còn 2 video cuối cùng thì tự động load thêm
      if (videoData.length - currentVideoIndex <= 2 && hasMore && !loading) {
        loadMoreVideos();
      }
      // Hoặc vẫn giữ điều kiện scroll gần cuối
      else if (distanceFromBottom < 100 && hasMore && !loading) {
        loadMoreVideos();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page, videoData.length, currentVideoIndex]);

  return (
    <div
      ref={containerRef}
      className="max-w-[400px] max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/20"
    >
      {videoData.map((video, index) => (
        <div
          key={`${video._id}-${index}`}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2
                      ${
                        index === currentVideoIndex
                          ? "bg-purple-600/20 border-2 border-purple-400 shadow-lg"
                          : "hover:bg-white/5"
                      }
                    `}
          onClick={() => handleChooseVideo(index)}
        >
          <div className="relative w-20 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={video.videoThumbnail}
              alt={video.videoDescription}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
              {video.videoDescription}
            </h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>{video.userId?.fullname || "Unknown"}</div>
              <div className="flex items-center gap-2">
                <span>{video.totalViews} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* No more videos indicator */}
      {!hasMore && videoData.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          No more videos to load
        </div>
      )}
    </div>
  );
};

export default OtherVideos;
