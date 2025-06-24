"use client";
import Header from "@/components/page/header";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import VideoFooter from "@/components/page/trending/video-footer";
import CommentSection from "@/components/page/trending/comments/comment_section";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useShowComment } from "@/context/ShowCommentContext";
import OtherVideos from "@/components/page/trending/otherVideo";
import { useSearchParams, useRouter } from "next/navigation";
import TagMusic from "@/components/music/tag.music";

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  const [isWatched, setIsWatched] = useState(false);
  const [isShowOtherVideos, setIsShowOtherVideos] = useState(false);
  // const [showComments, setShowComments] = useState<boolean>(false);
  const { showComments, setShowComments, showNotification } = useShowComment();
  const searchParams = useSearchParams();
  const [isFetchId, setIsFetchId] = useState(true);
  let id = searchParams.get("id");

  const [currentMusic, setCurrentMusic] = useState<IMusic | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (currentVideo) {
      const data = currentVideo?.musicId;
      console.log("Check data>>>>>", currentVideo);

      setCurrentMusic(data);
    }
  }, [currentVideo]);

  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  useEffect(() => {
    getVideoData();
  }, [accessToken, user]);
  useEffect(() => {
    const newIndex = currentVideoIndex + 1;
    setCurrentVideoIndex(newIndex);
    setCurrentVideo(videoData[newIndex]);
  }, [videoData.length]);
  const getVideoData = async () => {
    if (!accessToken || !user) return;
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
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
      setIsFetchId(false);
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
  const storageVideoId = (suggestVideoId: string) => {
    Cookies.set("suggestVideoId", suggestVideoId + "", { expires: 365 });
  };
  const handleScroll = async (event: React.WheelEvent) => {
    if (showComments || showNotification || isShowOtherVideos) {
      return;
    }

    setIsWatched(false);
    const videoSuggestId = Cookies.get("suggestVideoId");
    const res = await sendRequest<IBackendRes<IVideo[]>>({
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
    console.log(res);

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
    const res = await sendRequest<IBackendRes<IVideo[]>>({
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
    console.log(res);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleArrowKey);
    return () => {
      window.removeEventListener("keydown", handleArrowKey);
    };
  }, [currentVideoIndex, videoData, requestCount, accessToken, showComments]);
  useEffect(() => {
    getVideoData();
  }, []);

  useEffect(() => {
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);
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
  const handleVideoWatched = async () => {
    if (isWatched || !accessToken) return;
    setIsWatched(true);
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
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
      console.log(res);
      storageVideoId(currentVideo?._id + "");
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
    if (showComments) {
      return;
    }
    setIsWatched(false);
    const videoSuggestId = Cookies.get("suggestVideoId");
    const res = await sendRequest<IBackendRes<IVideo[]>>({
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
    console.log(res);
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

  const createViewingHistory = async () => {
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

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/page/search-user-video?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <div>
      <div onWheel={handleScroll}>
        <Header
          isGuest={false}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onClick={handleSearch}
        />
        {currentVideo ? (
          <MainVideo
            videoUrl={currentVideo.videoUrl}
            onVideoWatched={handleVideoWatched}
            onVideoDone={nextVideo}
          />
        ) : (
          <p>Loading video...</p>
        )}
        <VideoFooter
          videoDescription={currentVideo?.videoDescription || ""}
          totalView={currentVideo?.totalViews || 0}
          videoTag={currentVideo?.videoTag || []}
          createdAt={currentVideo?.createdAt?.toString() || ""}
        />
        {isShowOtherVideos ? (
          <OtherVideos
            isVisible={isShowOtherVideos}
            videoData={videoData}
            setCurrentVideo={setCurrentVideo}
            setIsShowOtherVideos={setIsShowOtherVideos}
            setCurrentVideoIndex={setCurrentVideoIndex}
          />
        ) : (
          <InteractSideBar
            creatorId={currentVideo?.userId.fullname || ""}
            userId={currentVideo?.userId._id || ""}
            onCommentClick={toggleComments}
            videoId={currentVideo?._id}
            numberComment={currentVideo?.totalComment}
            numberReaction={currentVideo?.totalReaction}
            onReactionAdded={onReactionAdded}
            onReactionRemove={onReactionRemove}
            isHidden={showComments}
          />
        )}
        {!isShowOtherVideos ? (
          <svg
            onClick={() => setIsShowOtherVideos(true)}
            xmlns="http://www.w3.org/2000/svg"
            className={`fixed right-[13%]
            bottom-1/2 transform -translate-y-1/2 cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800`}
            viewBox="0 0 448 512"
            fill="currentColor"
          >
            <path d="M207 273L71 409c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l152-152c9.4-9.4 9.4-24.6 0-33.9L104.9 105c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l136 136zm192 0L263 409c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l152-152c9.4-9.4 9.4-24.6 0-33.9L295.9 105c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l136 136z" />
          </svg>
        ) : (
          ""
        )}

        {showComments && (
          <CommentSection
            onCommentClick={toggleComments}
            videoId={currentVideo?._id}
            showComments={showComments}
            onCommentAdded={onCommentAdded}
            onCommentRemove={onCommentRemove}
          />
        )}
      </div>
      {currentMusic ? (
        <div className="w-64 h-20  bg-gray-900/80 absolute right-0 bottom-2 rounded-md flex px-2 mx-1">
          <TagMusic onClick={handleNavigate} item={currentMusic} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TrendingPage;
