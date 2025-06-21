import { handleGetAllCategoryAction } from "@/actions/category.action";
import { handleGetMusic } from "@/actions/music.action";
import ManageMusicTable from "@/components/admin/music.table";

const ManageUserPage = async ({ searchParams }: any) => {
  const { current, pageSize } = await searchParams;
  const result = current ? current : 1;
  const LIMIT = pageSize ? pageSize : 10;

  const res = await handleGetMusic(result, LIMIT);

  const data = res?.data;

  const meta = {
    current: data?.meta?.current || 1,
    pageSize: data?.meta?.pageSize || 10,
    total: data?.meta?.total || 1,
  };

  const cate = await handleGetAllCategoryAction()
  const dataCate: {
    _id: string,
    categoryName: string
  }[] = cate?.data

  const dataConfig: { value: string, title: string }[] = []

  dataCate && dataCate.length > 0 && dataCate.map(item => {
    const data = {
      value: item._id,
      title: item.categoryName
    }
    dataConfig.push(data)
  })

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
