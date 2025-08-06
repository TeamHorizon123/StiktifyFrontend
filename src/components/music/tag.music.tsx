import Image from "next/image"
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"
import { useState } from "react"
import ButtonPlayer from "./button.player"
import ReactHowler from "react-howler"

interface IProps {
    item: IMusic
    onClick: (v: string) => void,
    isOnPlayMusic?: boolean,
    animationText?: boolean,
    className?: string
}

const TagMusic = (props: IProps) => {
    const { item, onClick, isOnPlayMusic, animationText = true, className } = props
    const [isPlaying, setIsPlaying] = useState(false)
    const [hoverPlayer, setHoverPlayer] = useState(false)
    // Safety check
    if (!item || !item._id) {
        return null;
    }

    return (
        <div
            onClick={() => onClick(item._id)}
            className="flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200"
            onMouseLeave={() => {
                setHoverPlayer(false)
            }}
            onMouseEnter={() => setHoverPlayer(true)}
        >
            <div className="relative">
                <Image
                    height={50}
                    width={50}
                    className="rounded-lg object-cover"
                    alt="thumbnail"
                    src={!item.musicThumbnail || item.musicThumbnail === "" ? noImagePlaylist : item.musicThumbnail}
                />
                {/* Music Icon Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className={`font-bold text-white text-sm line-clamp-2 ${animationText ? "hover:animate-pulse" : ""} ${className}`}>
                    {item.musicDescription || "Unknown Track"}
                </div>
                <div className="text-purple-300 text-xs mt-1">
                    {item.userId?.fullname || "Unknown Artist"}
                </div>
            </div>
            {isOnPlayMusic && (
                <div>
                    <ButtonPlayer
                        current={item._id}
                        className={`transition-all duration-300 transform 
                         ${hoverPlayer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        isPlaying={isPlaying}
                        togglePlay={() => setIsPlaying(!isPlaying)}
                    />
                    <div hidden>
                        {item && item.musicUrl && <ReactHowler
                            src={item.musicUrl}
                            playing={isPlaying}
                            volume={1}
                        />}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TagMusic