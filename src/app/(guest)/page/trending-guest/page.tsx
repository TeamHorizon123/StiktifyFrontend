"use client";
import { handleSearchShortVideos } from "@/actions/manage.short.video.action";
import TagMusic from "@/components/music/tag.music";
import SearchCard from "@/components/page/search/searchCard";
import CommentSection from "@/components/page/trending/comments/comment_section";
import Header from "@/components/page/trending/header";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import OtherVideos from "@/components/page/trending/otherVideo";
import VideoFooter from "@/components/page/trending/video-footer";
import { useShowComment } from "@/context/ShowCommentContext";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const router = useRouter();
  const { showComments, setShowComments, showNotification } = useShowComment();

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  useEffect(() => {
    if (currentVideo) {
      const data = currentVideo?.musicId;
      setCurrentMusic(data);
    }
  }, [currentVideo]);

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
  useEffect(() => {
    const newIndex = currentVideoIndex + 1;
    setCurrentVideoIndex(newIndex);
    setCurrentVideo(videoData[newIndex]);
  }, [videoData.length]);
  const fetchSearchVideo = async () => {
    setLoading(true);
    const response: any = await handleSearchShortVideos(searchValue, 1, 10);
    setVideoDataSearch(response?.data?.result || []);
    setLoading(false);
  };
  const handleScroll = (event: React.WheelEvent) => {
    if (isShowOtherVideos) return;
    setIsWatched(false);
    if (event.deltaY > 0) {
      if (currentVideoIndex < videoData.length - 1) {
        const newIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      } else if (currentVideoIndex == videoData.length - 1) {
        setRequestCount(videoData.length / 10);
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
  useEffect(() => {
    getVideoData();
  }, []);
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
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);
  const handleArrowKey = async (event: KeyboardEvent) => {
    setIsWatched(false);
    if (event.key === "ArrowDown") {
      if (currentVideoIndex < videoData.length - 1) {
        const newIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      } else if (currentVideoIndex == videoData.length - 1) {
        setRequestCount(videoData.length / 10);
        getVideoData();
      }
    } else if (event.key === "ArrowUp") {
      if (currentVideoIndex > 0) {
        const newIndex = currentVideoIndex - 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      }
    }
  };
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
  };
  useEffect(() => {
    window.addEventListener("keydown", handleArrowKey);
    return () => {
      window.removeEventListener("keydown", handleArrowKey);
    };
  }, [currentVideoIndex, videoData, requestCount]);

  const handleNavigate = (id: string) => {
    router.push(`music/${id}`);
  };
  return (
    <div>
      <div onWheel={handleScroll}>
        <Header
          onClick={() => fetchSearchVideo()}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isGuest={true}
        />
        {videoDataSearch && videoDataSearch.length > 0 ? (
          <>
            <SearchCard videos={videoDataSearch} />
          </>
        ) : (
          <>
            {currentVideo ? (
              <MainVideo
                videoUrl={currentVideo.videoUrl}
                onVideoDone={nextVideo}
                onVideoWatched={handleVideoWatched}
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
                videoId={currentVideo?._id}
                numberComment={currentVideo?.totalComment}
                numberReaction={currentVideo?.totalReaction}
                isHidden={isShowOtherVideos}
                onCommentClick={toggleComments}
              />
            )}
            {!isShowOtherVideos ? (
              <svg
                onClick={() => setIsShowOtherVideos((prev) => !prev)}
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
          </>
        )}
        {showComments && (
          <CommentSection
            onCommentClick={toggleComments}
            videoId={currentVideo?._id}
            showComments={showComments}
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
