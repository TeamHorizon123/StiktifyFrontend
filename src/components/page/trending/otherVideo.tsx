import React, { Dispatch, SetStateAction } from "react";

interface OtherVideosProps {
  isVisible: boolean;
  videoData: IVideo[];
  currentVideoIndex: number;
  setCurrentVideoIndex: Dispatch<SetStateAction<number>>;
  setCurrentVideo: Dispatch<SetStateAction<IVideo | null>>;
  setIsShowOtherVideos: Dispatch<SetStateAction<boolean>>;
}

const OtherVideos: React.FC<OtherVideosProps> = ({
  videoData,
  currentVideoIndex,
  setCurrentVideoIndex,
  setCurrentVideo,
  setIsShowOtherVideos,
}) => {
  const handleChooseVideo = (index: number) => {
    setCurrentVideo(videoData[index]);
    setCurrentVideoIndex(index);
    setIsShowOtherVideos(false);
  };

  return (
    <div className="max-w-[400px]">
      {videoData.map((video, index) => (
        <div
          key={index}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors
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
              alt="Video thumbnail"
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
    </div>
  );
};

export default OtherVideos;
