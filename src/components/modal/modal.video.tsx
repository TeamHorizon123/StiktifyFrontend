import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    videoUrl: string,
    videoThumbnail: string
}
const ModalWatchVideo = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, videoUrl, videoThumbnail } = props
    const videoRef = useRef<HTMLVideoElement>(null);

    const [size, setSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth / 1.5 : 0,
        height: typeof window !== "undefined" ? window.innerHeight / 1.3 : 0
    });

    useEffect(() => {
        if (!isModalOpen) {
            if (videoRef.current) {
                videoRef.current.pause();
                // videoRef.current.currentTime = 0; 
            }
        }
    }, [isModalOpen])

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setSize({ width: window.innerWidth / 1.5, height: window.innerHeight / 1.3 });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            <Modal
                style={{ top: "8%" }}
                width={size.width}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                styles={{
                    content: { marginTop: 0, top: 0, padding: 5, paddingBottom: 1, backgroundColor: "#1e272e" },
                    body: { overflow: "hidden", }
                }}
                footer={false}
                closable={false}
            >
                <div>
                    <video
                        style={{
                            borderRadius: "5px"
                        }}
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        controls
                        autoPlay
                        loop
                        poster={videoThumbnail}>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </Modal>

        </>
    );
};

export default ModalWatchVideo;