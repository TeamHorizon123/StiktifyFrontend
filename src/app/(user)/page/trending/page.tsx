"use client";
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/page/trending/header";
import CommentSection from "@/components/page/trending/comments/comment_section";
import CreateCommentModal from "@/components/page/trending/comments/create-comment-modal";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import Cookies from "js-cookie";
import { useShowComment } from "@/context/ShowCommentContext";
import { useSearchParams, useRouter } from "next/navigation";
import TagMusic from "@/components/music/tag.music";
import {
  Play,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Video,
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Send,
  X,
  User,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button, Input } from "antd";

type SidebarMode = "videos" | "interactions" | "comments";

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const { user, accessToken } = React.useContext(AuthContext) ?? {};
  const [isWatched, setIsWatched] = useState(false);
  const { showNotification } = useShowComment();
  const searchParams = useSearchParams();
  const [isFetchId, setIsFetchId] = useState(true);
  const id = searchParams.get("id");
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const router = useRouter();

  // UI states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("videos");
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [userReactions, setUserReactions] = useState<{ [key: string]: number }>(
    {
      favorite: 0,
      like: 0,
      haha: 0,
      sad: 0,
      angry: 0,
    }
  );
  const [newComment, setNewComment] = useState("");
  const [refreshComments, setRefreshComments] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const reactions = [
    { type: "favorite", emoji: "❤️", label: "Favorite", color: "text-red-500" },
    { type: "like", emoji: "👍", label: "Like", color: "text-blue-400" },
    { type: "haha", emoji: "😂", label: "Haha", color: "text-yellow-400" },
    { type: "sad", emoji: "😢", label: "Sad", color: "text-blue-300" },
    { type: "angry", emoji: "😡", label: "Angry", color: "text-red-400" },
  ];

  useEffect(() => {
    if (currentVideo) {
      setCurrentMusic(currentVideo?.musicId || null);
    }
  }, [currentVideo]);

  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  useEffect(() => {
    getVideoData();
    // eslint-disable-next-line
  }, [accessToken, user]);

  useEffect(() => {
    setCurrentVideoIndex(0);
    setCurrentVideo(videoData[0]);
  }, []);

  useEffect(() => {
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);

  useEffect(() => {
    if (videoData.length > 0 && currentVideoIndex < videoData.length) {
      setCurrentVideo(videoData[currentVideoIndex]);
    }
  }, [videoData, currentVideoIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleArrowKey = async (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }
      setIsWatched(false);
      const videoSuggestId = Cookies.get("suggestVideoId");
      if (event.key === "ArrowDown") {
        if (currentVideoIndex < videoData.length - 1) {
          const newIndex = currentVideoIndex + 1;
          setCurrentVideoIndex(newIndex);
          setCurrentVideo(videoData[newIndex]);
        } else if (currentVideoIndex == videoData.length - 1) {
          setRequestCount((prev) => prev + 1);
          getVideoData();
        }
      } else if (event.key === "ArrowUp") {
        if (currentVideoIndex > 0) {
          const newIndex = currentVideoIndex - 1;
          setCurrentVideoIndex(newIndex);
          setCurrentVideo(videoData[newIndex]);
        }
      }
      // Gửi request theo hành động
      if (accessToken && user) {
        await sendRequest<IBackendRes<IVideo[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            userId: user?._id,
            id: videoSuggestId || currentVideo?._id,
            triggerAction: "ArrowKeyScroll",
          },
        });
      }
    };
    window.addEventListener("keydown", handleArrowKey);
    return () => {
      window.removeEventListener("keydown", handleArrowKey);
    };
    // eslint-disable-next-line
  }, [currentVideoIndex, videoData, requestCount, accessToken]);

  // Scroll navigation
  const handleScroll = async (event: React.WheelEvent) => {
    if (showNotification) {
      return;
    }
    setIsWatched(false);
    if (accessToken && user) {
      const videoSuggestId = Cookies.get("suggestVideoId");
      await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
          id: videoSuggestId || currentVideo?._id,
          triggerAction: "ScrollVideo",
        },
      });
    }
    if (event.deltaY > 0) {
      if (currentVideoIndex < videoData.length - 1) {
        const newIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      } else if (currentVideoIndex == videoData.length - 1) {
        setRequestCount((prev) => prev + 1);
        getVideoData();
      }
    } else {
      if (currentVideoIndex > 0) {
        const newIndex = currentVideoIndex - 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      }
    }
  };

  // Data fetching
  const getVideoData = async () => {
    try {
      let res = null;
      if (user && accessToken) {
        res = await sendRequest<IBackendRes<IVideo[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-user-videos`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            userId: user._id,
            videoId: isFetchId ? id || "" : "",
          },
        });
      } else if (!user && !accessToken) {
        res = await sendRequest<IBackendRes<IVideo[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-guest-videos`,
          method: "POST",
          body: {
            videoId: isFetchId ? id || "" : "",
          },
        });
      }
      setIsFetchId(false);
      if (res?.data && Array.isArray(res.data)) {
        if (requestCount === 0) {
          setVideoData(res.data);
          setRequestCount(1);
        } else {
          setVideoData((prev) => [...prev, ...(res.data || [])]);
          setRequestCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Failed to fetch trending videos:", error);
    }
  };

  // Video actions
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoWatched = async () => {
    if (isWatched || !accessToken) return;
    setIsWatched(true);
    try {
      await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
          id: currentVideo?._id,
          triggerAction: "WatchVideo",
        },
      });
      Cookies.set("suggestVideoId", currentVideo?._id + "", { expires: 365 });
      const res1 = await sendRequest<IBackendRes<IVideo>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/update-view-by-viewing`,
        method: "POST",
        body: {
          videoId: currentVideo?._id,
        },
      });
      setCurrentVideo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalViews: res1?.data?.totalViews ?? prev.totalViews,
        };
      });
    } catch (error) {
      console.error("Failed to fetch wishlist videos:", error);
    }
  };

  const nextVideo = async () => {
    setIsWatched(false);
    if (currentVideoIndex < videoData.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideo(videoData[newIndex]);
      if (newIndex === requestCount * 10 - 1) {
        setRequestCount((prev) => prev + 1);
        getVideoData();
      }
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideo(videoData[newIndex]);
      setIsWatched(false);
    }
  };

  // Social actions
  const handleReaction = (reaction: string) => {
    setSelectedReaction(selectedReaction === reaction ? null : reaction);
    setShowReactions(false);
    setUserReactions((prev) => ({
      ...prev,
      [reaction]: prev[reaction] + (selectedReaction === reaction ? -1 : 1),
    }));
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  const handlePostComment = async () => {
    if (!user || !accessToken || !newComment.trim() || !currentVideo?._id)
      return;
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          videoId: currentVideo._id,
          CommentDescription: newComment,
        },
      });
      setNewComment("");
      setRefreshComments((v) => v + 1); // trigger reload comment
    } catch (err) {
      // handle error (show toast, etc.)
    }
  };

  const getTotalReactions = () => {
    return Object.values(userReactions).reduce((sum, count) => sum + count, 0);
  };

  const relatedVideos = videoData.filter(
    (_, index) => index !== currentVideoIndex
  );

  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return; // đừng điều khiển video
      }
      if (!videoRef.current) return;

      // Space: Play/Pause
      if (event.code === "Space") {
        event.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }

      // // ArrowRight: Forward 5s
      // if (event.code === "ArrowRight") {
      //   videoRef.current.currentTime = Math.min(
      //     videoRef.current.duration,
      //     videoRef.current.currentTime + 5
      //   );
      // }

      // // ArrowLeft: Backward 5s
      // if (event.code === "ArrowLeft") {
      //   videoRef.current.currentTime = Math.max(
      //     0,
      //     videoRef.current.currentTime - 5
      //   );
      // }

      // M: Toggle mute
      if (event.key.toLowerCase() === "m") {
        setIsMuted((prev) => !prev);
      }
      // ArrowUp/ArrowDown: đã có xử lý ở useEffect khác
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted]);

  return (
    <div className="relative max-h-screen bg-black text-white">
      <Header
        isGuest={user ? false : true}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onClick={() => {
          if (!searchValue.trim()) return;
          router.push(
            `/page/search-user-video?q=${encodeURIComponent(searchValue)}`
          );
        }}
      />
      <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="relative z-10 flex h-full flex-row">
          {/* Video Column (Left) */}
          <div className="flex-1 flex items-center justify-center">
            <div
              onWheel={handleScroll}
              className="relative w-full h-full flex items-center justify-center"
              style={{ minHeight: "100vh" }}
            >
              {currentVideo ? (
                <div className="relative w-[80%] h-[85%] max-w-3xl max-h-[90vh] flex items-center justify-center bg-black rounded-2xl border-4 border-purple-700 shadow-xl">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain bg-black rounded-2xl"
                    src={currentVideo.videoUrl}
                    onClick={handleVideoClick}
                    onEnded={nextVideo}
                    onTimeUpdate={handleVideoWatched}
                    autoPlay
                    muted={isMuted}
                    loop={false}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      borderRadius: "1rem",
                    }}
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  {sidebarMode === "interactions" && (
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 rounded-lg backdrop-blur-sm text-white text-shadow">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {currentVideo.videoDescription}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>{currentVideo.totalViews} views</span>
                        <span>•</span>
                        <span>
                          {new Date(
                            currentVideo.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentVideo.videoTag?.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-white/20 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
                    <Button
                      shape="circle"
                      icon={<ChevronUp />}
                      onClick={prevVideo}
                      disabled={currentVideoIndex === 0}
                      className="text-white bg-black/30 hover:bg-white/20 w-10 h-10 p-0"
                    />
                    <Button
                      shape="circle"
                      icon={<ChevronDown />}
                      onClick={nextVideo}
                      disabled={currentVideoIndex === videoData.length - 1}
                      className="text-white bg-black/30 hover:bg-white/20 w-10 h-10 p-0"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Button
                      shape="circle"
                      icon={isMuted ? <VolumeX /> : <Volume2 />}
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white bg-black/30 hover:bg-white/20 w-10 h-10 p-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading video...</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-[400px] max-w-full h-full bg-gradient-to-b from-purple-800/90 to-purple-900/90 border-l border-purple-700 flex flex-col">
            <div className="flex gap-2 p-4">
              <button
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  sidebarMode === "videos"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-purple-900 text-purple-200 hover:bg-purple-800"
                }`}
                onClick={() => setSidebarMode("videos")}
              >
                <Video className="w-5 h-5" /> Videos
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  sidebarMode === "interactions"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-purple-900 text-purple-200 hover:bg-purple-800"
                }`}
                onClick={() => setSidebarMode("interactions")}
              >
                <Heart className="w-5 h-5" /> Social
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {sidebarMode === "videos" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ChevronRight className="h-5 w-5 text-purple-400" />
                    <h3 className="text-white font-semibold">Related Videos</h3>
                  </div>
                  {videoData.map((video, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2
      ${
        index === currentVideoIndex
          ? "bg-purple-400/30 border-2 border-purple-400 shadow-lg"
          : "hover:bg-white/5"
      }
    `}
                      onClick={() => {
                        setCurrentVideoIndex(index);
                        setCurrentVideo(videoData[index]);
                      }}
                    >
                      <div className="relative w-20 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden">
                        <video
                          className="w-full h-full object-cover"
                          src={video.videoUrl}
                          muted
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
                            <span>
                              {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {sidebarMode === "interactions" && (
                <div className="space-y-6">
                  {currentVideo && (
                    <div className="rounded-xl bg-white/10 p-4 flex items-center gap-4 mb-4">
                      <img
                        src={currentVideo.userId?.image}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-lg truncate">
                          {currentVideo.userId?.fullname || "Unknown"}
                        </div>
                        <div className="text-purple-200 text-sm truncate">
                          @{currentVideo.userId?.userName || "unknown"}
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`rounded-full w-8 h-8 p-0 ${
                          isFollowing
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white flex items-center justify-center`}
                      >
                        {isFollowing ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  <div className="rounded-xl bg-white/10 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white text-lg">
                        Total Reactions
                      </span>
                      <span className="font-bold text-2xl text-white">
                        {currentVideo?.totalReaction?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-0 py-2 justify-start"
                      icon={<Heart />}
                      type="text"
                    >
                      Like
                    </Button>
                    <Button
                      className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-0 py-2 justify-start"
                      icon={<MessageCircle />}
                      type="text"
                      onClick={() => setSidebarMode("comments")}
                    >
                      {currentVideo?.totalComment?.toLocaleString() || 0}{" "}
                      Comment
                    </Button>
                    <Button
                      className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-0 py-2 justify-start"
                      icon={<Share2 />}
                      type="text"
                    >
                      Share
                    </Button>
                    <Button
                      className="flex items-center gap-3 bg-transparent text-white hover:bg-purple-800/60 px-0 py-2 justify-start"
                      icon={<Flag />}
                      type="text"
                    >
                      Report
                    </Button>
                  </div>
                </div>
              )}
              {sidebarMode === "comments" && (
                <div className="flex flex-col h-full max-h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">
                      Comments (
                      {currentVideo?.totalComment?.toLocaleString() || 0})
                    </h3>
                    <Button
                      size="small"
                      onClick={() => setSidebarMode("interactions")}
                      className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                      type="text"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* Comment List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-320px)]">
                    <CommentSection
                      key={currentVideo?._id + sidebarMode + refreshComments}
                      videoId={currentVideo?._id}
                      showComments={sidebarMode === "comments"}
                      enableReply={true}
                      enableReact={true}
                      user={user}
                      userAvatar={user?.image}
                      onCommentAdded={() => setRefreshComments((v) => v + 1)}
                    />
                  </div>
                  {/* Comment Input */}
                  <div className="p-4 border-t border-white/10 bg-black/30">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt="User Avatar"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="flex-1 relative">
                          <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handlePostComment();
                              }
                            }}
                            className="w-full bg-transparent border border-purple-400 text-white placeholder-gray-400 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:border-purple-500 transition"
                            placeholder="Add a comment..."
                          />
                          <button
                            onClick={handlePostComment}
                            disabled={!newComment.trim()}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full
            ${
              newComment.trim()
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-purple-900/60"
            }
            text-white transition`}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        Please{" "}
                        <span
                          className="text-purple-400 font-semibold cursor-pointer"
                          onClick={() => router.push("/auth/login")}
                        >
                          login
                        </span>{" "}
                        to comment.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {currentMusic && (
          <div className="fixed bottom-4 right-4 w-64 h-16 bg-gray-800/70 backdrop-blur-md rounded-lg flex items-center px-3 border border-white/10">
            <TagMusic onClick={handleNavigate} item={currentMusic} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
