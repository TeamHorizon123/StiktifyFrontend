import { formatDateTimeVn } from "@/utils/utils";
import React from "react";

interface VideoFooterProps {
  videoDescription: string;
  totalView: number;
  videoTag: string[];
  createdAt: string;
}

const VideoFooter: React.FC<VideoFooterProps> = ({
  videoDescription,
  totalView,
  videoTag,
  createdAt,
}) => {
  return (
    <div className="w-[73%] bg-white  absolute left-30 top-[87vh] h-[90px] pl-2">
      <div className="mb-2 mt-2">
        <p className="text-lg font-bold">{videoDescription}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <span>{`#${videoTag.join(" #")}`}</span>
          <span>{`${totalView} views`}</span>
          <span>{`Uploaded on: ${formatDateTimeVn(createdAt)}`}</span>
        </div>
      </div>
    </div>
    // <div className="flex-1">
    //   <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
    //     {videoDescription}
    //   </h4>
    //   <div className="text-xs text-gray-400 space-y-1">
    //     <div className="flex items-center gap-2">
    //       <span>{`#${videoTag.join(" #")}`}</span>
    //       <span>{`${totalView} views`}</span>
    //       <span>•</span>
    //       <span>{new Date(createdAt).toLocaleDateString()}</span>
    //       <span>{`Uploaded on: ${formatDateTimeVn(createdAt)}`}</span>
    //     </div>
    //   </div>
    // </div>
  );
};

export default VideoFooter;
