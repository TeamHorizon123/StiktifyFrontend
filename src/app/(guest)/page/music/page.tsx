import { handleGetAllMusic } from "@/actions/music.action"
import ListMusic from "@/components/music/list.music";
import SideBarPlaylist from "@/components/playlist/sidebar.playlist";
const MusicGuestPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams
    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 50;

    const res = await handleGetAllMusic(result, LIMIT)
    const data = res?.data

    return (
        <div className="h-[86vh] overflow-y-auto border p-4 flex">
            <div >
                <ListMusic data={data ? data.result : []} />
            </div>
            <div className="bg-gray-100 h-[80vh] fixed right-5 w-[4vw] rounded-md flex justify-center overflow-y-auto">
                <SideBarPlaylist />
            </div>
        </div>
    )
}

export default MusicGuestPage