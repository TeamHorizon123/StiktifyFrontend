import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface IProps {
  videoId: string;
  videoThumbnail: string;
}

const VideoCustomize = (props: IProps) => {
  const { videoThumbnail, videoId } = props;
  const router = useRouter();

  return (
    <Tooltip overlayInnerStyle={{ background: "white", color: "#1e272e" }}>
      <div
        onClick={() => router.push(`/page/trending?id=${videoId}`)}
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <img
          src={videoThumbnail}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
          style={{ display: "block" }}
        />
      </div>
    </Tooltip>
  );
};

export default VideoCustomize;
