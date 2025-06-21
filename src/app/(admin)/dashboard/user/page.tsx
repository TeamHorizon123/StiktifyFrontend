import { handleGetAllUser } from "@/actions/manage.user.action";
import ManageUserTable from "@/components/admin/user.table";

const ManageUserPage = async ({ searchParams }: any) => {
  const { current, pageSize } = await searchParams;
  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 5;

  const res = await handleGetAllUser(result, LIMIT);

  const data = res?.data;

  const meta = {
    current: data?.meta?.current || 1,
    pageSize: data?.meta?.pageSize || 10,
    total: data?.meta?.total || 1,
  };
  return (
    <div>
      <ManageUserTable
        metaDefault={{ current: result, LIMIT: LIMIT }}
        dataSource={data?.result || []}
        meta={meta}
      />
    </div>
  );
};

export default ManageUserPage;
