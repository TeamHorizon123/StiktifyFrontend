import {
  handleGetDetailsPlaylistAction,
  handleGetMusicInPlaylistAction,
} from "@/actions/playlist.action";
import DisplayPlaylistDetail from "@/components/music/details.playlist";
import TableListMusicInPlaylist from "@/components/playlist/table.music";

const PlaylistPage = async ({ searchParams }: any) => {
  const { playlistId } = searchParams;

  const res = await handleGetMusicInPlaylistAction(playlistId);
  const data = res?.data;

  const playList = await handleGetDetailsPlaylistAction(playlistId);

  return (
    <div className="main-layout bg-gray-900 min-h-screen h-full pb-24">
      <div className="space-y-6 pb-8">
        <DisplayPlaylistDetail
          playlist={playList?.data.result[0]}
          item={data.result}
        />

        <div className="bg-gray-900/50 rounded-lg border border-gray-700/30 overflow-hidden mb-20 m-4">
          <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
            <TableListMusicInPlaylist
              playlistP={data.result}
              playlist={playList?.data.result[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
