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

    return (
        <div onClick={() => onClick(item._id)} className="flex items-center gap-2"
            onMouseLeave={() => {
                setHoverPlayer(false)
            }}
            onMouseEnter={() => setHoverPlayer(true)}
        >
            <Image height={50} width={50} className="rounded-md" alt="thumbnail" src={!item.musicThumbnail || item.musicThumbnail === "" ? noImagePlaylist : item.musicThumbnail} />
            <div className="w-full overflow-hidden whitespace-nowrap  text-white py-2">
                <div className={`font-roboto text-white font-bold text-1xl ${animationText ? "inline-block animate-marquee" : ""} ${className}`}>{item.musicDescription}</div>
                {/* <div className="font-roboto text-gray-400 text-[10px]  max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{item.musicDescription}</div> */}
            </div>
            {isOnPlayMusic ?
                <div>
                    <ButtonPlayer
                        current={item._id}
                        className={` transition-all duration-300 transform 
                         ${hoverPlayer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        isPlaying={isPlaying}
                        togglePlay={() => setIsPlaying(!isPlaying)} />
                    <div hidden>
                        {item && item.musicUrl && <ReactHowler
                            src={item.musicUrl}
                            playing={isPlaying}
                            volume={1}
                        />}
                    </div>
                </div>
                : <></>
            }

        </div>
    )
}

export default TagMusic