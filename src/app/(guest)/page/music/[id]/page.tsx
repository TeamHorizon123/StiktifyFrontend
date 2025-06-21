import { handleDisPlayMusicAction } from "@/actions/music.action";
import MusicDetailClient from "@/components/music/music.detail";

const MusicDetail = async ({ params }: any) => {
  const { id } = params;
  const res = await handleDisPlayMusicAction(id);
  const data = res?.data;
  if (res?.error) {
    return <div>Not found id</div>;
  }

  return <MusicDetailClient data={data} id={id} />;
};

export default MusicDetail;
