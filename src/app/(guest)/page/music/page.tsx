import { handleGetAllMusic } from "@/actions/music.action";
import ListMusic from "@/components/music/list.music";
import SideBarPlaylist from "@/components/playlist/sidebar.playlist";
const MusicGuestPage = async ({ searchParams }: any) => {
  const { current, pageSize } = await searchParams;
  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 50;

  const res = await handleGetAllMusic(result, LIMIT);
  const data = res?.data;

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 pr-20">
        <ListMusic data={data ? data.result : []} />
      </div>
      <div className="fixed right-4 top-4 bottom-20 w-16 bg-gray-100 rounded-md flex justify-center overflow-y-auto z-10">
        <SideBarPlaylist />
      </div>
    </div>
  );
};

export default MusicGuestPage;
