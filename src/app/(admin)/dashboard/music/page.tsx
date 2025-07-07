import { handleFilterAndSearchMusicAction } from "@/actions/music.action";
import ManageMusicTable from "@/components/admin/music.table";

const ManageUserPage = async ({ searchParams }: any) => {
  const { current, pageSize } = await searchParams;
  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 10;

  const res = await handleFilterAndSearchMusicAction(result, LIMIT,searchParams?.search || "", searchParams?.filterReq || "");

  const data = res?.data;

  const meta = {
    current: data?.meta?.current || 1,
    pageSize: data?.meta?.pageSize || 10,
    total: data?.meta?.total || 1,
  };

 const dataConfig: { value: string, title: string }[] = [
  { value: "recent", title: "Most Recent" },
  { value: "oldest", title: "Oldest" },
  { value: "blocked", title: "Blocked" },
  { value: "flagged", title: "Flagged" },
  { value: "mostListend", title: "Most Listened" },
];


  return (
    <div>
      <ManageMusicTable
        dataFilter={dataConfig}
        metaDefault={{ current: result, LIMIT: LIMIT }}
        dataSource={data?.result || []}
        meta={meta}
      />
    </div>
  );
};

export default ManageUserPage;
