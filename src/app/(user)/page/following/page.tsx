"use client";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import CommentSection from "@/components/page/trending/comments/comment_section";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import Cookies from "js-cookie";
import { useShowComment } from "@/context/ShowCommentContext";
import { useSearchParams, useRouter } from "next/navigation";
import TagMusic from "@/components/music/tag.music";
import { Video, Heart, Send, X, Users } from "lucide-react";
import { Button } from "antd";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import OtherVideos from "@/components/page/trending/otherVideo";
import { handleGetFollowing } from "@/actions/follow.action";

type SidebarMode = "videos" | "interactions" | "comments";

const FollowingPage = () => {
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const [isWatched, setIsWatched] = useState(false);
  const { showNotification } = useShowComment();
  const searchParams = useSearchParams();
  const [isFetchId, setIsFetchId] = useState(true);
  const id = searchParams.get("id");
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("videos");
  const [newComment, setNewComment] = useState("");
  const [refreshComments, setRefreshComments] = useState(0);
  const [noFollowingVideos, setNoFollowingVideos] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const isFetchingRef = useRef(false);
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
  }, [accessToken, user]);

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
      if (isFetchingRef.current) return;
      setIsWatched(false);
      const videoSuggestId = Cookies.get("suggestVideoId");

      if (event.key === "ArrowDown") {
        if (currentVideoIndex < videoData.length - 1) {
          const newIndex = currentVideoIndex + 1;
          setCurrentVideoIndex(newIndex);
          setCurrentVideo(videoData[newIndex]);
        } else if (currentVideoIndex === videoData.length - 1) {
          isFetchingRef.current = true;
          getVideoData();
        }

        if (accessToken && user) {
          await sendRequest<IBackendRes<IVideo[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: {
              userId: user._id,
              id: videoSuggestId || currentVideo?._id,
              triggerAction: "ArrowKeyScroll",
            },
          });
        }
      } else if (event.key === "ArrowUp") {
        if (currentVideoIndex > 0) {
          const newIndex = currentVideoIndex - 1;
          setCurrentVideoIndex(newIndex);
          setCurrentVideo(videoData[newIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleArrowKey);
    return () => {
      window.removeEventListener("keydown", handleArrowKey);
    };
  }, [
    currentVideoIndex,
    videoData,
    requestCount,
    accessToken,
    user,
    currentVideo,
  ]);

  // Scroll navigation
  const handleScroll = useCallback(
    async (event: WheelEvent) => {
      if (isFetchingRef.current) return;

      // Chặn ngay từ đầu
      isFetchingRef.current = true;

      console.log("Scroll event detected");

      if ((event.target as HTMLElement).closest(".video-controls")) {
        isFetchingRef.current = false;
        return;
      }

      if (showNotification) {
        isFetchingRef.current = false;
        return;
      }

      event.preventDefault();

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
          isFetchingRef.current = false; // Cho phép scroll tiếp
        } else if (currentVideoIndex === videoData.length - 1) {
          console.log("Fetching more videos by scroll");
          await getVideoData();
          isFetchingRef.current = false;
        }
      } else {
        if (currentVideoIndex > 0) {
          const newIndex = currentVideoIndex - 1;
          setCurrentVideoIndex(newIndex);
          setCurrentVideo(videoData[newIndex]);
        }
        isFetchingRef.current = false;
      }
    },
    [
      accessToken,
      user,
      showNotification,
      currentVideo,
      currentVideoIndex,
      videoData
    ]
  );


  // Data fetching
  const getVideoData = async () => {
    if (!accessToken || !user) return;
    try {
      const res = await handleGetFollowing(requestCount + 1, user._id);
      const data: IVideo[] = res?.data.result;
      console.log("Check Following data>>>>", data);

      setIsFetchId(false);
      if (data && data.length > 0) {
        setNoFollowingVideos(false);
        if (requestCount === 0) {
          setVideoData(data);
          setRequestCount(1);
        } else {
          setVideoData((prev) => [...prev, ...(data || [])]);
          setRequestCount((prev) => prev + 1);
        }
        isFetchingRef.current = false;
      } else if (requestCount === 0) {
        // Không có video nào từ following
        setNoFollowingVideos(true);
      }

    } catch (error) {
      console.log("Failed to fetch following videos:", error);
      if (requestCount === 0) {
        setNoFollowingVideos(true);
      }
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
    if (currentVideoIndex < videoData.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideo(videoData[newIndex]);
    } else if (currentVideoIndex === videoData.length - 1) {
      getVideoData();
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (!videoRef.current) return;

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
            ? { ...video, totalReaction: (video.totalReaction || 0) + 1 }
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
            ? { ...video, totalReaction: (video.totalReaction || 0) - 1 }
            : video
        )
      );
    }
  };

  useEffect(() => {
    if (currentVideo) {
      // kiểm tra type của musicId
      console.log("currentVideo.musicId type:", typeof currentVideo.musicId);
      console.log("currentVideo.musicId data:", currentVideo.musicId);

      // Kiểm tra xem musicId có tồn tại và có phải là object không
      if (currentVideo.musicId) {
        if (typeof currentVideo.musicId === 'object' && currentVideo.musicId._id) {
          console.log("Setting currentMusic to object:", currentVideo.musicId);
          setCurrentMusic(currentVideo.musicId as IMusic);
        } else if (typeof currentVideo.musicId === 'string') {
          console.log("musicId is string, setting currentMusic to null");
          setCurrentMusic(null);
        } else {
          console.log("musicId is invalid object, setting currentMusic to null");
          setCurrentMusic(null);
        }
      } else {
        console.log("No musicId found, setting currentMusic to null");
        setCurrentMusic(null);
      }
      setIsWatched(false);
    }
  }, [currentVideo?._id]);

  // Hiển thị thông báo khi không có video following
  if (noFollowingVideos) {
    return (
      <div className="relative min-h-screen main-layout text-white bg-[#18182c] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Users className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            No Following Videos
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            You have not followed anyone yet! Follow some creators to see their
            latest videos here.
          </p>
          <button
            onClick={() => router.push("/page/trending")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Discover Videos
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen main-layout text-white">
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
                <div className="relative flex flex-col items-center justify-center w-full h-full rounded-2xl left-[9%]">
                  <div
                    className="flex items-center justify-center w-full"
                    style={{ height: "85vh" }}
                  >
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{ marginTop: "-60px" }}
                    >
                      <MainVideo
                        videoUrl={currentVideo.videoUrl}
                        onVideoWatched={handleVideoWatched}
                        onVideoDone={nextVideo}
                        videoRef={videoRef}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading following videos...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="w-[450px] max-w-full h-full bg-[#18182c] flex flex-col">
            <div className="flex gap-2 p-4">
              <button
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${sidebarMode === "videos"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-purple-900 text-purple-200 hover:bg-purple-800"
                  }`}
                onClick={() => setSidebarMode("videos")}
              >
                <Video className="w-5 h-5" /> Videos
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${sidebarMode === "interactions"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-purple-900 text-purple-200 hover:bg-purple-800"
                  }`}
                onClick={() => setSidebarMode("interactions")}
              >
                <Heart className="w-5 h-5" /> Social
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 h-[full]">
              {sidebarMode === "videos" && (
                <OtherVideos
                  isVisible={true}
                  videoData={videoData}
                  currentVideoIndex={currentVideoIndex}
                  setCurrentVideoIndex={setCurrentVideoIndex}
                  setCurrentVideo={setCurrentVideo}
                  setIsShowOtherVideos={() => { }}
                  setVideoData={setVideoData}
                />
              )}

              {sidebarMode === "interactions" && (
                <div className="h-full">
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
                    currentMusic={currentVideo?.musicId && typeof currentVideo.musicId === 'object' ? currentVideo.musicId as IMusic : null}
                  />
                </div>
              )}

              {sidebarMode === "comments" && (
                <div className="flex flex-col h-full">
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
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full">
                    <CommentSection
                      key={currentVideo?._id + sidebarMode + refreshComments}
                      videoId={currentVideo?._id}
                      showComments={sidebarMode === "comments"}
                      user={user}
                      userAvatar={user?.image}
                      onCommentAdded={onCommentAdded}
                      onCommentRemove={onCommentRemove}
                    />
                  </div>
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
                              ${newComment.trim()
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
      </div>
    </div>
  );
};

export default FollowingPage;
