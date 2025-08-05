"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CommentSection from "@/components/page/trending/comments/comment_section";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import Cookies from "js-cookie";
import { useShowComment } from "@/context/ShowCommentContext";
import { useSearchParams, useRouter } from "next/navigation";
import TagMusic from "@/components/music/tag.music";
import { Video, Heart, Send, X } from "lucide-react";
import { Button } from "antd";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import OtherVideos from "@/components/page/trending/otherVideo";
import Header from "@/components/page/trending/header";

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
  const [isGetGuestVideo, setIsGetGuestVideo] = useState(false);
  // UI states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("videos");
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [userReactions, setUserReactions] = useState<{
    [key: string]: number;
  }>();
  const [newComment, setNewComment] = useState("");
  const [refreshComments, setRefreshComments] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (currentVideo) {
      setCurrentMusic(currentVideo?.musicId || null);
    }
  }, [currentVideo?._id]);

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
  }, [isGetGuestVideo]);

  useEffect(() => {
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);

  useEffect(() => {
    if (videoData.length > 0 && currentVideoIndex < videoData.length) {
      setCurrentVideo(videoData[currentVideoIndex]);
    }
  }, [videoData, currentVideoIndex]);

  useEffect(() => {
    if (currentVideo?.segments?.length && currentVideo.segments.length > 0) {
      console.log("Current video segments:", currentVideo.segments);
      const playFromM3U8 = async () => {
        try {
           const mediaSource = new MediaSource();
        videoRef.current!.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener("sourceopen", async () => {
          const sb = mediaSource.addSourceBuffer(
            'video/mp2t; codecs="avc1.42E01E, mp4a.40.2"'
          );
          const segmentIndices = await parseM3U8FromPNG(currentVideo.m3u8_png);

          for (const idx of segmentIndices) {
            try {
              const buffer = await loadSegment(currentVideo.segments[idx]);
              sb.appendBuffer(buffer);
              await new Promise((resolve) =>
                sb.addEventListener("updateend", resolve, { once: true })
              );
            } catch (err) {}
          }
          if (mediaSource.readyState === "open") {
            mediaSource.endOfStream();
          }
        });
        } catch (error) {
          
        }
       
      };
      playFromM3U8();
    }
  }, [currentVideo?._id]);

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
    if ((event.target as HTMLElement).closest(".video-controls")) {
      return;
    }
    if (showNotification) {
      return;
    }
    event.preventDefault(); // ngăn scroll mặc định
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
            videoId: isGetGuestVideo || isFetchId ? id || "" : "",
          },
        });
        console.log("res-user", res);
        setIsGetGuestVideo(false);
        if (isGetGuestVideo) {
          setVideoData([]);
          setRequestCount(0);
        }
      } else {
        setIsGetGuestVideo(true);
        res = await sendRequest<IBackendRes<IVideo[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-guest-videos`,
          method: "POST",
          body: {
            videoId: isFetchId ? id || "" : "",
          },
        });
        console.log("res", res);
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
      const isPause = Cookies.get("isPause");
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
      if (isPause == "true") return;
      if (currentVideo?._id) handleAddUserAction(currentVideo?._id);
      createViewingHistory();
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
  const handleAddUserAction = async (videoId: string) => {
    if (!accessToken) return;
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/action?action=view&id=${videoId}&`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error add action:", error);
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
      setRefreshComments((v) => v + 1);
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };
  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return;
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
      // M: Toggle mute
      if (event.key.toLowerCase() === "m") {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted]);
  const onCommentAdded = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalComment: (currentVideo.totalComment || 0) + 1,
      });

      setVideoData((prevVideos) =>
        prevVideos.map((video) =>
          video._id === currentVideo._id
            ? { ...video, totalComment: (video.totalComment || 0) + 1 }
            : video
        )
      );
    }
  };
  const createViewingHistory = async () => {
    if (!user || !accessToken || !currentVideo?._id) return;
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/viewinghistory`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
          videoId: currentVideo?._id,
        },
      });
    } catch (error) {
      console.error("Failed to create Viewing History:", error);
    }
  };
  const onCommentRemove = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalComment: (currentVideo.totalComment || 0) - 1,
      });

      setVideoData((prevVideos) =>
        prevVideos.map((video) =>
          video._id === currentVideo._id
            ? { ...video, totalComment: (video.totalComment || 0) - 1 }
            : video
        )
      );
    }
  };
  const onReactionAdded = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalReaction: (currentVideo.totalReaction || 0) + 1,
      });

      setVideoData((prevVideos) =>
        prevVideos.map((video) =>
          video._id === currentVideo._id
            ? { ...video, totalComment: (video.totalReaction || 0) + 1 }
            : video
        )
      );
    }
  };
  const onReactionRemove = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalReaction: (currentVideo.totalReaction || 0) - 1,
      });

      setVideoData((prevVideos) =>
        prevVideos.map((video) =>
          video._id === currentVideo._id
            ? { ...video, totalComment: (video.totalReaction || 0) + 1 }
            : video
        )
      );
    }
  };
  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex < videoData.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/page/search-user-video?q=${encodeURIComponent(searchValue)}`);
  };

  const parseM3U8FromPNG = async (pngUrl: string): Promise<number[]> => {
    const proxyUrl = `/api/proxy?id=${encodeURIComponent(pngUrl)}`;
    const res = await fetch(proxyUrl);
    const blob = await res.blob();
    const imageBitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const bytes: number[] = [];
    for (let i = 0; i < imageData.length; i += 4) {
      bytes.push(imageData[i]); // R
    }

    const text = new TextDecoder().decode(new Uint8Array(bytes));
    console.log("📜 M3U8 content:", text);
    const lines = text
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim());

    const indices = lines
      .map((line) => {
        const match = line.match(/output(\d+)\.ts/);
        return match ? parseInt(match[1], 10) : -1;
      })
      .filter((index) => index >= 0);

    return indices;
  };

  const loadSegment = async (url: string): Promise<Uint8Array> => {
    const proxyUrl = `/api/proxy?id=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    const blob = await res.blob();
    const imageBitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Lấy mỗi pixel (1 byte) từ kênh R (vì "L" → RGB đều bằng nhau)
    const tsBytes: number[] = [];
    for (let i = 0; i < imageData.length; i += 4) {
      tsBytes.push(imageData[i]); // Chỉ lấy R
    }

    return new Uint8Array(tsBytes);
  };

  return (
    <div className="relative min-h-screen main-layout text-white">
       <div className="fixed top-4 left-1/2 transform -translate-x-[68%] flex items-center justify-center z-50">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (handleSearch) handleSearch();
            }
          }}
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[50vw] md:w-[40vw] lg:w-[35vw] px-4 py-2 border border-purple-700 bg-gray-900 text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleSearch}
          className="flex items-center justify-center px-4 py-2 rounded-r-lg border border-purple-700 bg-purple-700 hover:bg-purple-800 transition"
          aria-label="Search"
        >
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
        </button>
      </div>
      <div className="h-screen overflow-hidden">
        <div className="relative z-10 flex h-full flex-row">
          {/* Video Column (Left) */}
          <div className="flex-1 flex items-center justify-center pl-8">
            <div
              onWheel={handleScroll}
              className="relative w-full h-full flex items-center justify-center pr-4"
              style={{ minHeight: "100vh" }}
            >
              {currentVideo ? (
                <div className="relative flex flex-col items-center justify-center w-full h-full rounded-2xl left-[4%]">
                  {/* Video player */}
                  <div
                    className="flex items-center justify-center w-full"
                    style={{ height: "85vh" }}
                  >
                    <div
                      className="rounded-2xl flex items-center justify-center "
                      style={{ marginTop: "-60px" }}
                    >
                      <MainVideo
                        videoUrl={currentVideo.videoUrl}
                        onVideoWatched={handleVideoWatched}
                        onVideoDone={nextVideo}
                        videoRef={videoRef}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onScrollNext={handleNextVideo}
                        onScrollPrev={handlePrevVideo}
                      />
                    </div>
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

          <div className="w-[450px] max-w-full h-full bg-[#18182c] flex flex-col">
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

            <div className="flex-1 overflow-y-auto px-4 pb-4 h-[calc(100vh-120px)]">
              {sidebarMode === "videos" && (
                <OtherVideos
                  isVisible={true}
                  videoData={videoData}
                  currentVideoIndex={currentVideoIndex}
                  setCurrentVideoIndex={setCurrentVideoIndex}
                  setCurrentVideo={setCurrentVideo}
                  setIsShowOtherVideos={() => {}} // Không cần dùng trong context này
                />
              )}

              {sidebarMode === "interactions" && (
                <div className="h-full">
                  {/* User Info */}
                  <InteractSideBar
                    creatorId={currentVideo?.userId?.fullname || ""}
                    userId={currentVideo?.userId?._id || ""}
                    avatarUrl={currentVideo?.userId?.image}
                    videoId={currentVideo?._id}
                    numberComment={currentVideo?.totalComment}
                    numberReaction={currentVideo?.totalReaction}
                    onReactionAdded={onReactionAdded}
                    onReactionRemove={onReactionRemove}
                    onCommentClick={() => setSidebarMode("comments")}
                    isHidden={false}
                    videoDescription={currentVideo?.videoDescription}
                    totalViews={currentVideo?.totalViews}
                    createdAt={currentVideo?.createdAt?.toString()}
                    videoTags={currentVideo?.videoTag}
                  />
                </div>
              )}
              {sidebarMode === "comments" && (
                <div className="flex flex-col h-full">
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
                      user={user}
                      userAvatar={user?.image}
                      onCommentAdded={onCommentAdded}
                    />
                  </div>
                  {/* Comment Input */}
                  <div className="rounded-xl bg-white/10 p-4">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.image}
                          alt="User Avatar"
                          width={36}
                          height={36}
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
                          login{" "}
                        </span>
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
          <div className="fixed bottom-4 left-4 w-80 h-20 bg-black/80 backdrop-blur-md rounded-xl flex px-3 border border-white/10 z-10">
            <TagMusic onClick={handleNavigate} item={currentMusic} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
