"use client"

import Image from "next/image"
import ButtonPlayer from "./button.player"
import { useContext, useEffect, useState } from "react"
import image from "@/assets/images/gratisography-augmented-reality-800x525.jpg"
import { useRouter } from "next/navigation"
import { useGlobalContext } from "@/library/global.context"
import { FaBarsStaggered } from "react-icons/fa6";
import { Dropdown, MenuProps, notification, Tooltip } from "antd"
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"
import { RiPlayListLine } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { handleAddMusicInPlaylistAction } from "@/actions/playlist.action"
import AddPlayList from "../modal/modal.add.playlist"
import { AuthContext } from "@/context/AuthContext"
interface IProps {
    showPlaying?: boolean,
    handlePlayer: (v: any) => void
    isPlaying: boolean,
    item: IMusic
    ref?: any,
    isInUserPage?: boolean
}

const CardMusic = (props: IProps) => {
    const { handlePlayer, isPlaying, item, ref, showPlaying = true } = props
    const { trackCurrent, playlist, listPlaylist, } = useGlobalContext()!
    const { user } = useContext(AuthContext)!
    const [hoverPlayer, setHoverPlayer] = useState(false)
    const router = useRouter()
    const [items, setItems] = useState<MenuProps["items"] | []>([])
    const [isOpenModal, setIsOpenModal] = useState(false)

    const handleItem = (track: IMusic) => {
        handlePlayer(track)
    }

    const handleNavigate = (id: string) => {
        router.push(`/page/music/${id}`)
    }

    useEffect(() => {
        if (trackCurrent?._id === item._id) {
            setHoverPlayer(true)
        } else {
            setHoverPlayer(false)
        }
    }, [trackCurrent, item])

    useEffect(() => {
        const playlistArr: MenuProps["items"] = []
        if (playlist && playlist.length > 0) {

            playlist.map((item, index) => {
                const config = {
                    key: item._id,
                    label: <div className="flex items-center gap-2">
                        <Image height={30} width={30} className="rounded-md" alt="thumbnail" src={!item.image || item.image === "" ? noImagePlaylist : item.image} />
                        <div>
                            <div className="font-roboto font-bold text-1xl">{item.name}</div>
                            <div className="font-roboto text-gray-400 text-[10px]  max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{item.description} </div>
                        </div>
                    </div>,
                }
                playlistArr.push(config)
            })
        }
        const addNewPlaylist = {
            key: playlistArr.length + 1,
            label: <div>New playlist</div>,
            icon: <MdOutlinePlaylistAdd size={20} />
        }
        playlistArr.push(addNewPlaylist)
        const data: MenuProps["items"] = [
            {
                key: '1',
                label: <div className="font-medium font-roboto text-black">Add Playlist</div>,
                icon: <RiPlayListLine size={20} />,
                children: playlistArr,
                expandIcon: null
            },
        ]
        setItems(data)

    }, [playlist])

    const handleAddMusicInPlaylist = async (playlistId: string) => {
        if (user) {
            if (playlistId.length >= 10) {
                const res = await handleAddMusicInPlaylistAction(playlistId, item._id)
                if (res?.statusCode === 201) {
                    return notification.success({ message: res.message })
                }
                return notification.warning({ message: res?.message })
            }
            if (playlist.length < 3) {
                return setIsOpenModal(true)
            }
            return notification.warning({ message: "Please upgrade to Premium to continue using this feature" })
        }

        return router.push("/auth/login")

    }

    const handleUpdateMusic = () => {

    }
    return (
        <>
            <div ref={ref}
                onClick={() => handleNavigate(item._id)}
                onMouseLeave={() => {
                    trackCurrent?._id !== item._id && setHoverPlayer(false)
                }}
                onMouseEnter={() => setHoverPlayer(true)}
                className="rounded-lg px-1 py-2 shadow-lg hover:bg-slate-100 relative cursor-pointer"
            >
                <Dropdown
                    menu={{
                        items,
                        onClick: (e) => {
                            e.domEvent.stopPropagation();
                            handleAddMusicInPlaylist(e.key)
                        },
                    }}>
                    <FaBarsStaggered onClick={(e) => e.stopPropagation()} className="absolute text-white top-3 right-2 hover:text-green-400" size={20} />
                </Dropdown>
                <Image
                    alt="thumbnail"
                    className="rounded-lg select-none"
                    width={200}
                    height={200}
                    src={item ? item.musicThumbnail : image} />
                <Tooltip title={item.musicDescription}>
                    <div className="mt-2 text-[20px] font-semibold font-roboto truncate w-[10vw] select-none">{item.musicDescription}</div>
                </Tooltip>
                {showPlaying &&
                    <ButtonPlayer
                        current={item._id}
                        className={`absolute right-2 bottom-6 transition-all duration-300 transform 
                     ${hoverPlayer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        isPlaying={isPlaying}
                        togglePlay={() => handleItem(item)} />
                }

            </div>
            <AddPlayList isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
        </>
    )
}

export default CardMusic;