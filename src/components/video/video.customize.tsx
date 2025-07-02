import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface IProps {
    videoId: string,
    videoThumbnail: string
}

const VideoCustomize = (props: IProps) => {
    const { videoThumbnail, videoId } = props
    const [watchVideo, setWatchVideo] = useState(false)
    const router = useRouter()

    return (
        <>
            <Tooltip overlayInnerStyle={{ background: "white", color: "#1e272e" }} title="Watch Video" >
                <div
                    onClick={() => router.push(`/page/trending?id=${videoId}`)}
                    style={{
                        width: "150px",
                        aspectRatio: "16/9",
                        borderRadius: "3px",
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        textAlign: "center",
                        overflow: "hidden",
                        cursor: "pointer"
                    }}
                >

                    <img
                        src={videoThumbnail}
                        alt="Video Thumbnail"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }} />

                </div >
            </Tooltip>
        </>
    )
}

export default VideoCustomize;