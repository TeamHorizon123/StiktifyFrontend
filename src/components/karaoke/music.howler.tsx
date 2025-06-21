"use client";
import { formatTime } from "@/utils/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactHowler from "react-howler";
import {
    FaStepForward,
    FaStepBackward,
    FaVolumeMute,
    FaVolumeUp,
    FaPause,
    FaPlay,
} from "react-icons/fa";
import { useGlobalContext } from "@/library/global.context";
import { getTrackRelatedAction } from "@/actions/music.action";

interface MusicPlayerProps {
    setIsDonePlaying?: (v: boolean) => void;
    setIsPlayingProp: (v: boolean) => void;
    isPlayingProp: boolean;
    setSeekProps: (v: number) => void;
}

const MusicPlayerKaraoke = (p: MusicPlayerProps) => {
    const {
        listPlaylist,
        setTrackCurrent,
        setFlag,
        trackRelatedId,
        prevList,
        musicTagRelated,
        trackKaraoke,
    } = useGlobalContext()!;

    const [volume, setVolume] = useState(1);
    const playerRef = useRef<ReactHowler>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [seek, setSeek] = useState(0);
    const [duration, setDuration] = useState(0);
    const { setIsDonePlaying, isPlayingProp, setIsPlayingProp, setSeekProps } = p;

    // Cập nhật seek props liên tục
    useEffect(() => {
        setSeekProps(seek);
        if (seek >= duration - 1.3 && setIsDonePlaying && duration > 0) {
            setIsDonePlaying(true);
        }
    }, [seek, duration, setSeekProps, setIsDonePlaying]);

    const toggleMute = () => setVolume(prev => prev > 0 ? 0 : 1);

    const nextTrack = () => {
        if (listPlaylist.length > 0) {
            const nextIndex = (listPlaylist.findIndex(t => t._id === trackKaraoke?._id) + 1);
            if (nextIndex < listPlaylist.length) {
                setTrackCurrent(listPlaylist[nextIndex]);
            }
        }
    };

    const prevTrack = async () => {
        if (listPlaylist.length > 0) {
            const prevIndex = (listPlaylist.findIndex(t => t._id === trackKaraoke?._id) - 1);
            if (prevIndex >= 0) {
                setTrackCurrent(listPlaylist[prevIndex]);
            }
        } else if (prevList.length > 0) {
            const res = await getTrackRelatedAction(trackRelatedId, musicTagRelated);
            setTrackCurrent(res?.data);
        }
    };

    // Thiết lập interval để cập nhật seek
    useEffect(() => {
        if (isPlayingProp) {
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    const currentSeek = playerRef.current.seek() as number;
                    setSeek(currentSeek);
                }
            }, 100);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlayingProp]);

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSeek = parseFloat(e.target.value);
        setSeek(newSeek);
        if (playerRef.current) {
            playerRef.current.seek(newSeek);
        }
    };

    const handleLoad = () => {
        if (playerRef.current) {
            const dur = playerRef.current.duration() as number;
            setDuration(dur);
        }
    };

    const handleEnd = () => {
        setSeek(0);
        setFlag(false);
        nextTrack();
    };

    return (
        <div className="w-1/2 h-full bg-transparent backdrop-blur-md text-white p-4 rounded-2xl shadow-lg">
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
                <div className="flex gap-10 items-center justify-center">
                    <button onClick={prevTrack} className="hover:text-green-400 transition">
                        <FaStepBackward size={24} />
                    </button>
                    <button
                        onClick={() => setIsPlayingProp(!isPlayingProp)}
                        className="w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-400 transition rounded-full shadow-md"
                    >
                        {isPlayingProp ? <FaPause size={24} /> : <FaPlay className="ms-1" size={24} />}
                    </button>
                    <button onClick={nextTrack} className="hover:text-green-400 transition">
                        <FaStepForward size={24} />
                    </button>
                </div>

                <div className="flex justify-center items-center gap-5 w-[40vw] mt-4">
                    <span>{formatTime(Math.floor(seek))}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={seek}
                        onChange={handleSeekChange}
                        className="w-full h-1"
                    />
                    <span>{formatTime(Math.floor(duration))}</span>
                </div>

                <div className="flex justify-end items-center gap-2 w-[25vw] mt-4">
                    <button onClick={toggleMute} className="hover:text-green-400 transition">
                        {volume > 0 ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="ml-2 w-full h-1 bg-white rounded-lg cursor-pointer"
                    />
                </div>
            </div>

            <div hidden>
                {trackKaraoke && trackKaraoke?.musicSeparate?.length > 0 &&
                    (
                        <>
                            <ReactHowler
                                key={trackKaraoke._id}
                                src={trackKaraoke.musicSeparate[0]}
                                playing={isPlayingProp}
                                volume={volume}
                                ref={playerRef}
                                onLoad={handleLoad}
                                onEnd={handleEnd}
                            />
                            <ReactHowler
                                key={trackKaraoke._id}
                                src={trackKaraoke.musicSeparate[1]}
                                playing={isPlayingProp}
                                volume={volume}
                                ref={playerRef}
                                onLoad={handleLoad}
                                onEnd={handleEnd}
                            />
                            <ReactHowler
                                key={trackKaraoke._id}
                                src={trackKaraoke.musicSeparate[2]}
                                playing={isPlayingProp}
                                volume={volume}
                                ref={playerRef}
                                onLoad={handleLoad}
                                onEnd={handleEnd}
                            />
                        </>
                    )
                    // trackKaraoke.musicSeparate.map((url, index) => (
                    //     <ReactHowler
                    //         key={index}
                    //         src={url}
                    //         playing={isPlayingProp}
                    //         volume={volume}
                    //         ref={index === 0 ? playerRef : undefined}
                    //         onLoad={index === 0 ? handleLoad : undefined}
                    //         onEnd={index === 0 ? handleEnd : undefined}
                    //     />
                    // ))
                }
            </div>
        </div>
    );
};

export default MusicPlayerKaraoke;