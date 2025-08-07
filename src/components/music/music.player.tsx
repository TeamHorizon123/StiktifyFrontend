"use client";
import { formatTime } from "@/utils/utils";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import ReactHowler from "react-howler";
import {
  FaStepForward,
  FaStepBackward,
  FaVolumeMute,
  FaVolumeUp,
  FaHeartbeat,
} from "react-icons/fa";
import { FaShuffle, FaRepeat } from "react-icons/fa6";
import ButtonPlayer from "./button.player";
import { useGlobalContext } from "@/library/global.context";
import Image from "next/image";
import {
  getTrackRelatedAction,
  handleListenNeo4j,
  handleUpdateListenerAction,
} from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { sendRequest } from "@/utils/api";
import { GiMicrophone } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { GoDesktopDownload } from "react-icons/go";
import { notification } from "antd";
interface MusicPlayerProps {
  setIsDonePlaying?: Dispatch<SetStateAction<boolean>>;
}

const MusicPlayer = (p: MusicPlayerProps) => {
  const {
    isPlaying,
    setIsPlaying,
    trackCurrent,
    listPlaylist,
    setTrackCurrent,
    flag,
    setFlag,
    trackRelatedId,
    setTrackRelatedId,
    prevList,
    setPrevList,
    musicTagRelated,
    setMusicTagRelated,
    setTrackKaraoke,
    setListPlayList,
  } = useGlobalContext()!;
  const [volume, setVolume] = useState(1);
  const playerRef = useRef<ReactHowler | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [count, setCount] = useState(0);
  const [second, setSecond] = useState(0);
  const [isMusicPaused, setIsMusicPaused] = useState(false);
  const [countTrack, setCountTrack] = useState(0);
  const [countRelated, setCountRelated] = useState(0);
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const { setIsDonePlaying } = p;
  const router = useRouter();

  useEffect(() => {
    if (seek >= duration - 1.3 && setIsDonePlaying && duration > 0) {
      setIsDonePlaying(true);
    }
  }, [seek]);

  const handleTriggerWishListScore = async (musicId: string) => {
    const res = await sendRequest<IBackendRes<IVideo[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wishlist`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        userId: user._id,
        id: musicId,
        triggerAction: "ListenMusic",
      },
    });
  };

  const handleAddUserAction = async (musicId: string) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/action?action=reaction&id=${musicId}&`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error add reaction:", error);
    }
  };

  useEffect(() => {
    if (trackCurrent !== null && trackCurrent) {
      if (!trackRelatedId.some((x: any) => x === trackCurrent._id)) {
        if (listPlaylist.length === 0 && listPlaylist) {
          setTrackRelatedId([...trackRelatedId, trackCurrent._id]);
          setPrevList([...prevList, trackCurrent]);

          const newTags = trackCurrent.musicTag.filter(
            (tag) =>
              !musicTagRelated.some(
                (existingTag) => existingTag._id === tag._id
              )
          );

          if (newTags.length > 0) {
            setMusicTagRelated([...musicTagRelated, ...newTags]);
          }
        }
      } else {
        setTrackRelatedId([trackCurrent._id]);
        setPrevList([trackCurrent]);
        setMusicTagRelated(trackCurrent.musicTag);
      }
    }
  }, [trackCurrent]);

  useEffect(() => {
    setIsMusicPaused(Cookies.get("isMusicPause") === "true");
  }, []);

  const togglePlay = useCallback(
    () => setIsPlaying(!isPlaying),
    [isPlaying, setIsPlaying]
  );
  const toggleMute = useCallback(
    () => setVolume((prev) => (prev > 0 ? 0 : 1)),
    []
  );
  // const nextTrack = useCallback(() => setCountTrack((prev) => (prev + 1) % listPlaylist.length), [listPlaylist.length]);
  // const prevTrack = useCallback(() => setCountTrack((prev) => (prev - 1 + listPlaylist.length) % listPlaylist.length), [listPlaylist.length]);
  useEffect(() => {
    setCountTrack(0);
  }, []);
  const nextTrack = useCallback(async () => {
    console.log("listPlaylist>>>", listPlaylist);

    if (listPlaylist.length > 0) {
      setCountTrack((prev) => (prev + 1) % listPlaylist.length);
      // const nextTrack = listPlaylist[(countTrack + 1) % listPlaylist.length];
    } else {
      setSecond(0);
      setFlag(false);
      const res = await getTrackRelatedAction(trackRelatedId, musicTagRelated);
      setTrackCurrent(res?.data);
    }
  }, [listPlaylist, countTrack, trackRelatedId, musicTagRelated]);

  const prevTrack = useCallback(async () => {
    if (listPlaylist.length > 0) {
      setCountTrack(
        (prev) => (prev - 1 + listPlaylist.length) % listPlaylist.length
      );
    } else if (prevList.length > 0) {
      setCountRelated((prev) => (prev - 1 + prevList.length) % prevList.length);
    }
  }, [listPlaylist.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current) setSeek(playerRef.current.seek());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!trackCurrent || flag || second < 15) return;
    (async () => {
      if (!flag) {
        if (user) {
          await handleListenNeo4j(trackCurrent._id, user._id);

          if (!isMusicPaused) {
            await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/create-listening-history`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  userId: user._id,
                  musicId: trackCurrent._id,
                }),
              }
            );
          }
        }
        await handleUpdateListenerAction(trackCurrent._id);
        setFlag(true);
        if (trackCurrent) {
          await handleTriggerWishListScore(trackCurrent?._id);
          await handleAddUserAction(trackCurrent?._id);
        }
      }
      setSecond(0);
    })();
  }, [second, trackCurrent, user, isMusicPaused, accessToken, flag]);

  useEffect(() => {
    setCount((prev) => prev + 1);

    if (count === Math.round(seek)) {
      setSecond((prev) => prev + 1);
    }

    if (Math.round(seek) !== count) {
      setCount(Math.round(seek) + 1);
      setSecond(0);
    }
  }, [seek]);

  useEffect(() => {
    if (+seek.toFixed(0) === +duration.toFixed(0)) {
      (async () => {
        if (listPlaylist.length > 0) {
          setCountTrack((prev) => (prev + 1) % listPlaylist.length);
        } else if (prevList.length > 0) {
          const res = await getTrackRelatedAction(
            trackRelatedId,
            musicTagRelated
          );
          setTrackCurrent(res?.data);
        }
      })();
    }
  }, [second, duration]);

  useEffect(() => {
    if (trackCurrent) {
      localStorage.setItem("trackCurrent", JSON.stringify(trackCurrent));
    }
  }, [trackCurrent]);

  useEffect(() => {
    console.log("Check prevList>>>>>", prevList);

    if (listPlaylist.length > 0) {
      const newTrack =
        listPlaylist[countTrack]?.musicId || listPlaylist[countTrack];
      if (newTrack) {
        setTrackCurrent(newTrack);
      }
    } else if (prevList.length > 0) {
      const newTrack = prevList[countRelated];
      if (newTrack) {
        setTrackCurrent(newTrack);
      }
    }
  }, [listPlaylist, countTrack, setTrackCurrent, countRelated]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);

    if (playerRef.current) {
      playerRef.current.seek(newSeek);
      setIsPlaying(false);
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleLoad = useCallback(() => {
    if (playerRef.current) setDuration(playerRef.current.duration());
  }, []);

  const handleEndMusic = useCallback(async () => {
    setSecond(0);
    setFlag(false);
    console.log("Track>>>>", trackRelatedId);

    const res = await getTrackRelatedAction(trackRelatedId, musicTagRelated);
    setTrackCurrent(res?.data);
    console.log(res);
  }, [
    prevList,
    listPlaylist.length,
    trackRelatedId,
    musicTagRelated,
    setTrackCurrent,
    playerRef,
  ]);

  const handleKaraoke = () => {
    if (trackCurrent) {
      setTrackKaraoke(trackCurrent);
      localStorage.setItem("trackKaraoke", JSON.stringify(trackCurrent));
      router.push("/page/karaoke");
    } else {
      notification.warning({ message: "Not found track" });
    }
  };

  const downloadFile = async () => {
    const fileUrl = trackCurrent?.musicUrl!;
    const fileName = trackCurrent?.musicDescription!;
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (+seek.toFixed(0) === +duration.toFixed(0) - 1) {
      handleEndMusic();
    }
  }, [seek, duration]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900/80 backdrop-blur-md text-white p-4 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-5">
        {/* Phần thông tin bài hát */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0 w-1/4">
          {trackCurrent && trackCurrent.musicThumbnail && (
            <Image
              className="rounded-lg flex-shrink-0"
              src={trackCurrent?.musicThumbnail}
              alt="thumbnail"
              width={50}
              height={50}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate flex items-center gap-2">
              <span className="truncate">{trackCurrent?.musicDescription}</span>
              <FaHeartbeat size={16} className="flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Phần điều khiển chính */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={() => downloadFile()}
              className="hover:text-purple-400 transition"
            >
              <GoDesktopDownload size={18} />
            </button>

            <button className="hover:text-purple-400 transition">
              <FaShuffle size={18} />
            </button>

            <button
              onClick={prevTrack}
              className="hover:text-purple-400 transition"
            >
              <FaStepBackward size={18} />
            </button>

            <ButtonPlayer
              current={trackCurrent?._id}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />

            <button
              onClick={nextTrack}
              className="hover:text-purple-400 transition"
            >
              <FaStepForward size={18} />
            </button>

            <button className="hover:text-purple-400 transition">
              <FaRepeat size={18} />
            </button>

            {trackCurrent?.isKaraoke && (
              <button
                onClick={handleKaraoke}
                className="hover:text-purple-400 transition"
              >
                <GiMicrophone size={18} />
              </button>
            )}
          </div>

          {/* Thanh tiến trình */}
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <span className="text-xs flex-shrink-0 w-12 text-center">
              {formatTime(Math.floor(seek))}
            </span>
            <input
              type="range"
              min={0}
              max={duration}
              value={seek}
              onChange={handleSeekChange}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs flex-shrink-0 w-12 text-center">
              {formatTime(Math.floor(duration))}
            </span>
          </div>
        </div>

        {/* Phần điều khiển âm lượng */}
        <div className="flex items-center gap-2 flex-shrink-0 w-1/4 justify-end">
          <button
            onClick={toggleMute}
            className="hover:text-purple-400 transition"
          >
            {volume > 0 ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div hidden>
          {trackCurrent && trackCurrent.musicUrl && (
            <ReactHowler
              src={trackCurrent.musicUrl}
              playing={isPlaying}
              volume={volume}
              ref={playerRef}
              onLoad={handleLoad}
              onEnd={handleEndMusic}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
