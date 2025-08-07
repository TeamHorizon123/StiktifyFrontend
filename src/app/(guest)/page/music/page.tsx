import { handleGetAllMusic } from "@/actions/music.action";
import ListMusic from "@/components/music/list.music";
import SideBarPlaylist from "@/components/playlist/sidebar.playlist";
import { cookies } from "next/headers";
const MusicGuestPage = async ({ searchParams }: any) => {
  const { current, pageSize } = await searchParams;
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 50;

  const res = await handleGetAllMusic(result, LIMIT);
  const data = res?.data;


  // return (
  //   <div className="min-h-screen flex pb-[15vh] main-layout ">
  //     <div className="flex-1">
  //       <ListMusic data={data ? data.result : []} />
  //     </div>
  //     <div className="fixed top-0 bottom-20 w-20 bg-gray-100 rounded-md flex justify-center overflow-y-auto z-10">
  //       <SideBarPlaylist />
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen flex pb-[15vh] main-layout">
      {/* Nội dung chính */}
      <div className="flex-1">
        {/* Chừa khoảng trống cho sidebar */}
        <ListMusic data={data ? data.result : []} />
      </div>
      {/* Sidebar Playlist */}
      {!token && <div className="fixed top-10 right-0 h-[75%] rounded-md flex justify-center overflow-y-auto z-10">
        <SideBarPlaylist />
      </div>}
    </div>
  );
};

export default MusicGuestPage;
