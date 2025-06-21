import { handleGetAllUserTickedAction } from "@/actions/manage.user.ticked.action";
import ManageUserTickedTable from "@/components/admin/user.ticked.table";

const UserTickedReportPage = async ({ searchParams }: any) => {
  const { current, pageSize } = searchParams;

  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 5;

  const res = await handleGetAllUserTickedAction(result, LIMIT);
  const data = res?.data;
  console.log(data?.result[0]?.userData);

  const meta = {
    current: data?.meta?.current || 1,
    pageSize: data?.meta?.pageSize || 10,
    total: data?.meta?.total || 1,
  };

  return (
    <div>
      <ManageUserTickedTable
        metaDefault={{ current: result, LIMIT: LIMIT }}
        dataSource={data?.result || []}
        meta={meta}
      />
    </div>
  );
};

export default UserTickedReportPage;
