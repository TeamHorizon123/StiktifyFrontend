import React, { Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";

interface OtherVideosProps {
  isVisible: boolean;
  videoData: IVideo[];
  setCurrentVideoIndex: Dispatch<SetStateAction<number>>;
  setCurrentVideo: Dispatch<SetStateAction<IVideo | null>>;
  setIsShowOtherVideos: Dispatch<SetStateAction<boolean>>;
}

const OtherVideos: React.FC<OtherVideosProps> = ({
  isVisible,
  videoData,
  setCurrentVideoIndex,
  setCurrentVideo,
  setIsShowOtherVideos
}) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  
    return () => {
      document.body.style.overflow = ""; 
    };
  }, [isVisible]);
  

  const handleChooseVideo = (index: number) => {
    setCurrentVideo(videoData[index]);
    setCurrentVideoIndex(index);
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: isVisible ? "0%" : "100%", opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`w-[25%] bg-[#F8F8F8] shadow-lg fixed right-0 top-[95px] pt-5 px-5 h-full overflow-y-auto ${
        isVisible ? "" : "hidden"
      }`}
    >
        <svg
            onClick={() => setIsShowOtherVideos(false)}
            xmlns="http://www.w3.org/2000/svg"
            className={`fixed right-[23%]
             bottom-1/2 transform -translate-y-1/2 cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800`}
            viewBox="0 0 448 512"
            fill="currentColor"
          >
            <path d="M207 273L71 409c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l152-152c9.4-9.4 9.4-24.6 0-33.9L104.9 105c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l136 136zm192 0L263 409c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l152-152c9.4-9.4 9.4-24.6 0-33.9L295.9 105c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l136 136z" />
          </svg>
      <div className="space-y-4 ml-[30px] mb-[120px]">
        {videoData.map((video, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 cursor-pointer"
            onClick={() => {
              handleChooseVideo(index);
            }}
          >
            <img
              src={video.videoThumbnail}
              alt="Video Thumbnail"
              className="w-[55%] h-[13vh] object-cover rounded-md"
            />
            <p className="text-sm text-gray-700 max-w-[45%] break-words leading-tight">
              {video.videoDescription}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OtherVideos;
