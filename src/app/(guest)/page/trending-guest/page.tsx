"use client";
import { handleSearchShortVideos } from "@/actions/manage.short.video.action";
import TagMusic from "@/components/music/tag.music";
import SearchCard from "@/components/page/search/searchCard";
import CommentSection from "@/components/page/trending/comments/comment_section";
import { useShowComment } from "@/context/ShowCommentContext";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Button, Input } from "antd";
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
  Smile,
  Send,
  X,
  User,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/page/trending/header";

type Reaction = "like" | "haha" | "sad" | "angry" | "favorite";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

type SidebarMode = "videos" | "interactions" | "comments";

interface IVideo {
  _id: string;
  videoUrl: string;
  videoDescription: string;
  createdAt: string;
  totalViews: number;
  totalReaction: number;
  totalComment: number;
  videoTag?: string[];
  musicId?: IMusic;
  userId?: {
    _id: string;
    fullname: string;
    username: string;
  };
}

interface IMusic {
  id: string;
  name: string;
}

interface IBackendRes<T> {
  data: T;
}

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [videoDataSearch, setVideoDataSearch] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isWatched, setIsWatched] = useState(false);
  const [isShowOtherVideos, setIsShowOtherVideos] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("videos");
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null
  );
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { showComments, setShowComments, showNotification } = useShowComment();

  const reactions = [
    { type: "favorite", emoji: "❤️", label: "Favorite", color: "text-red-500" },
    { type: "like", emoji: "👍", label: "Like", color: "text-blue-400" },
    { type: "haha", emoji: "😂", label: "Haha", color: "text-yellow-400" },
    { type: "sad", emoji: "😢", label: "Sad", color: "text-blue-300" },
    { type: "angry", emoji: "😡", label: "Angry", color: "text-red-400" },
  ];
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const toggleComments = () => {
    setShowComments((prev) => !prev);
    setSidebarMode("comments");
  };

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
  const getVideoData = async () => {
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-guest-videos`,
        method: "POST",
      });

      if (res.data && Array.isArray(res.data)) {
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

  const fetchSearchVideo = async () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    const response: any = await handleSearchShortVideos(searchValue, 1, 10);
    setVideoDataSearch(response?.data?.result || []);
    setLoading(false);
  };

  const handleVideoWatched = async () => {
    if (isWatched) return;
    setIsWatched(true);
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
  };

  useEffect(() => {
    getVideoData();
  }, []);

  useEffect(() => {
    if (currentVideo === null && videoData.length > 0) {
      setCurrentVideo(videoData[0]);
    }
  }, [videoData]);

  useEffect(() => {
    if (videoData.length > 0 && currentVideoIndex < videoData.length) {
      setCurrentVideo(videoData[currentVideoIndex]);
    }
  }, [videoData, currentVideoIndex]);

  const nextVideo = async () => {
    if (currentVideoIndex < videoData.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideo(videoData[newIndex]);
      if (newIndex === requestCount * 10 - 1) {
        setRequestCount(videoData.length / 10);
        getVideoData();
      }
    }
    setIsWatched(false);
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideo(videoData[newIndex]);
      setIsWatched(false);
    }
  };

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

  const handleReaction = (reaction: Reaction) => {
    setSelectedReaction(selectedReaction === reaction ? null : reaction);
    setShowReactions(false);
    setUserReactions((prev) => ({
      ...prev,
      [reaction]: prev[reaction] + (selectedReaction === reaction ? -1 : 1),
    }));
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      console.log("Comment:", commentText);
      setCommentText("");
    }
  };

  const handleScroll = (event: React.WheelEvent) => {
    if (isShowOtherVideos) return;
    event.preventDefault();
    if (event.deltaY > 0) {
      nextVideo();
    } else {
      prevVideo();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleVideoClick();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        prevVideo();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        nextVideo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVideoIndex, isPlaying]);

  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };

  const getTotalReactions = () => {
    return Object.values(userReactions).reduce((sum, count) => sum + count, 0);
  };

  const relatedVideos = videoData.filter(
    (_, index) => index !== currentVideoIndex
  );

  if (videoDataSearch && videoDataSearch.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="absolute top-20 left-4 z-50">
          <Button
            onClick={() => {
              setVideoDataSearch([]);
              setSearchValue("");
            }}
            shape="circle"
            icon={<X />}
            className="text-white hover:bg-white/20"
          />
        </div>
        <div className="pt-16">
          <SearchCard videos={videoDataSearch} />
        </div>
      </div>
    );
  }

  // Sidebar render helper
  const renderSidebar = () => (
    <div className="w-full sm:w-72 lg:w-80 bg-black/20 backdrop-blur-md border-l border-white/10 h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <div className="flex rounded-lg bg-black/20 backdrop-blur-md border border-white/10 p-1">
          <Button
            type="default"
            onClick={() => setSidebarMode("videos")}
            className={`flex-1 ${
              sidebarMode === "videos"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Video className="h-5 w-5 mr-2" />
            Videos
          </Button>
          <Button
            type="default"
            onClick={() => setSidebarMode("interactions")}
            className={`flex-1 ${
              sidebarMode === "interactions"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Heart className="h-5 w-5 mr-2" />
            Social
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Videos Tab */}
        {sidebarMode === "videos" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-semibold">Related Videos</h3>
            </div>
            {relatedVideos.slice(0, 10).map((video, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => {
                  const newIndex = videoData.findIndex(
                    (v) => v._id === video._id
                  );
                  setCurrentVideoIndex(newIndex);
                  setCurrentVideo(videoData[newIndex]);
                }}
              >
                <div className="relative w-24 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden">
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
        {/* Social Tab */}
        {sidebarMode === "interactions" && (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
            {currentVideo && (
              <div className="flex flex-col gap-3 p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {currentVideo.userId?.fullname || "Unknown"}
                    </div>
                    <div className="text-gray-400 text-sm">
                      @{currentVideo.userId?.username || "unknown"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Creator | 1.2M Followers
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`rounded-full w-8 h-8 p-0 ${
                      isFollowing
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    {isFollowing ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Loves creating short, funny videos to brighten your day! 🎉
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button
                    onClick={() => setShowReactions(!showReactions)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 flex items-center gap-2 p-2 rounded-lg"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        selectedReaction === "favorite"
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm">
                      {currentVideo?.totalReaction || 0}
                    </span>
                  </Button>
                  {showReactions && (
                    <div className="absolute top-12 left-0 bg-black/80 backdrop-blur-md rounded-lg p-2 flex gap-2 z-10">
                      {reactions.map((reaction) => (
                        <Button
                          size="small"
                          onClick={() => handleReaction(reaction.type)}
                          className={`text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 ${
                            selectedReaction === reaction.type
                              ? reaction.color
                              : ""
                          }`}
                          key={reaction.type}
                          title={reaction.label}
                        >
                          <span className="text-xl">{reaction.emoji}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                {getTotalReactions() > 0 && (
                  <div className="flex items-center gap-1">
                    {selectedReaction && (
                      <span className="text-xl">
                        {
                          reactions.find((r) => r.type === selectedReaction)
                            ?.emoji
                        }
                      </span>
                    )}
                    <span className="text-white font-medium text-sm">
                      {getTotalReactions()}
                    </span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setSidebarMode("comments")}
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  {currentVideo?.totalComment || 0} Comments
                </span>
              </Button>
              <Button className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                <Share2 className="h-5 w-5 mr-2" />
                <span className="text-sm">Share</span>
              </Button>
              <Button className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                <Flag className="h-5 w-5 mr-2" />
                <span className="text-sm">Report</span>
              </Button>
            </div>
          </div>
        )}
        {/* Comments Tab */}
        {sidebarMode === "comments" && (
          <div className="flex flex-col h-full max-h-full">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">
                Comments ({currentVideo?.totalComment || 0})
              </h3>
              <Button
                size="small"
                onClick={() => setSidebarMode("interactions")}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              <CommentSection
                onCommentClick={toggleComments}
                videoId={currentVideo?._id}
                showComments={true}
              />
            </div>
            <div className="p-4 border-t border-white/10 bg-black/30">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 rounded-lg"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCommentSubmit()
                    }
                  />
                  <Button
                    type="primary"
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-8 h-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* <Header
        onClick={() => fetchSearchVideo()}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isGuest={true}
      /> */}
      <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex h-full flex-col lg:flex-row">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 flex items-center justify-center p-2">
                <div
                  onWheel={handleScroll}
                  className="relative w-full max-w-screen-md lg:max-w-3xl h-full flex items-center justify-center"
                >
                  {currentVideo ? (
                    <div className="relative w-full h-full max-w-2xl mx-auto bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover cursor-pointer"
                        src={currentVideo.videoUrl}
                        onClick={handleVideoClick}
                        onEnded={nextVideo}
                        onTimeUpdate={handleVideoWatched}
                        autoPlay
                        muted={isMuted}
                        loop={false}
                      />
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                      )}
                      {/* Video Info Overlay */}
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
                      {/* Navigation Buttons */}
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
                      {/* Volume Control */}
                      <div className="absolute top-4 left-4">
                        <Button
                          shape="circle"
                          icon={isMuted ? <VolumeX /> : <Volume2 />}
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white bg-black/30 hover:bg-white/20 w-10 h-10 p-0"
                        />
                      </div>
                      {/* Progress Indicator */}
                      <div className="absolute left-16 top-1/2 transform -translate-y-1/2">
                        <div className="flex flex-col gap-1">
                          {videoData.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1 h-6 rounded-full transition-all duration-300 ${
                                index === currentVideoIndex
                                  ? "bg-white"
                                  : "bg-white/30"
                              }`}
                            />
                          ))}
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

              <div className="w-80 bg-black/20 backdrop-blur-md border-l border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <div className="flex rounded-lg bg-black/20 backdrop-blur-md border border-white/10 p-1">
                    <Button
                      type="default"
                      onClick={() => setSidebarMode("videos")}
                      className={`flex-1 ${
                        sidebarMode === "videos"
                          ? "bg-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Videos
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setSidebarMode("interactions")}
                      className={`flex-1 ${
                        sidebarMode === "interactions"
                          ? "bg-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Social
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {sidebarMode === "videos" && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ChevronRight className="h-5 w-5 text-purple-400" />
                        <h3 className="text-white font-semibold">
                          Related Videos
                        </h3>
                      </div>
                      {relatedVideos.slice(0, 10).map((video, index) => (
                        <div
                          key={index}
                          className="flex gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => {
                            const newIndex = videoData.findIndex(
                              (v) => v._id === video._id
                            );
                            setCurrentVideoIndex(newIndex);
                            setCurrentVideo(videoData[newIndex]);
                          }}
                        >
                          <div className="relative w-24 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden">
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
                                  {new Date(
                                    video.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sidebarMode === "interactions" && (
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                      {currentVideo && (
                        <div className="flex flex-col gap-3 p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">
                                {currentVideo.userId?.fullname || "Unknown"}
                              </div>
                              <div className="text-gray-400 text-sm">
                                @{currentVideo.userId?.username || "unknown"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Creator | 1.2M Followers
                              </div>
                            </div>
                            <Button
                              onClick={() => setIsFollowing(!isFollowing)}
                              className={`rounded-full w-8 h-8 p-0 ${
                                isFollowing
                                  ? "bg-gray-500 hover:bg-gray-600"
                                  : "bg-red-500 hover:bg-red-600"
                              } text-white`}
                            >
                              {isFollowing ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-sm text-gray-400 mt-2">
                            Loves creating short, funny videos to brighten your
                            day! 🎉
                          </div>
                        </div>
                      )}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Button
                              onClick={() => setShowReactions(!showReactions)}
                              className="text-gray-400 hover:text-white hover:bg-white/10 flex items-center gap-2 p-2 rounded-lg"
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  selectedReaction === "favorite"
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                              <span className="text-sm">
                                {currentVideo?.totalReaction || 0}
                              </span>
                            </Button>
                            {showReactions && (
                              <div className="absolute top-12 left-0 bg-black/80 backdrop-blur-md rounded-lg p-2 flex gap-2 z-10">
                                {reactions.map((reaction) => (
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      handleReaction(reaction.type)
                                    }
                                    className={`text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 ${
                                      selectedReaction === reaction.type
                                        ? reaction.color
                                        : ""
                                    }`}
                                    key={reaction.type}
                                    title={reaction.label}
                                  >
                                    <span className="text-xl">
                                      {reaction.emoji}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          {getTotalReactions() > 0 && (
                            <div className="flex items-center gap-1">
                              {selectedReaction && (
                                <span className="text-xl">
                                  {
                                    reactions.find(
                                      (r) => r.type === selectedReaction
                                    )?.emoji
                                  }
                                </span>
                              )}
                              <span className="text-white font-medium text-sm">
                                {getTotalReactions()}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => setSidebarMode("comments")}
                          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          <span className="text-sm">
                            {currentVideo?.totalComment || 0} Comments
                          </span>
                        </Button>
                        <Button className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                          <Share2 className="h-5 w-5 mr-2" />
                          <span className="text-sm">Share</span>
                        </Button>
                        <Button className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                          <Flag className="h-5 w-5 mr-2" />
                          <span className="text-sm">Report</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {sidebarMode === "comments" && (
                    <div className="flex flex-col h-full max-h-full">
                      {/* Header */}
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-white font-semibold">
                          Comments ({currentVideo?.totalComment || 0})
                        </h3>
                        <Button
                          size="small"
                          onClick={() => setSidebarMode("interactions")}
                          className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      {/* Comment List */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-320px)]">
                        <CommentSection
                          onCommentClick={toggleComments}
                          videoId={currentVideo?._id}
                          showComments={true}
                        />
                      </div>
                      {/* Comment Input */}
                      <div className="p-4 border-t">
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add a comment..."
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 rounded-lg"
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleCommentSubmit()
                              }
                            />

                            <Button
                              type="primary"
                              onClick={handleCommentSubmit}
                              disabled={!commentText.trim()}
                              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-8 h-8 p-0"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
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
      </div>
    </div>
  );
};

export default TrendingPage;
