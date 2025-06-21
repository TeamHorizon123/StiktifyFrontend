import { Tooltip } from "antd";
import { useState } from "react";
import ModalWatchVideo from "../modal/modal.video";
interface IProps {
    videoUrl: string,
    videoThumbnail: string
}

const VideoCustomize = (props: IProps) => {
    const { videoThumbnail, videoUrl } = props
    const [watchVideo, setWatchVideo] = useState(false)

    return (
        <>
            <ModalWatchVideo videoThumbnail={videoThumbnail} videoUrl={videoUrl} isModalOpen={watchVideo} setIsModalOpen={setWatchVideo} />
            <Tooltip overlayInnerStyle={{ background: "white", color: "#1e272e" }} title="Watch Video" >
                <div
                    onClick={() => setWatchVideo(true)}
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