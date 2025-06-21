import { handleGetAllShortVideo } from "@/actions/manage.short.video.action";
import ManageShortVideoTable from "@/components/admin/short.video.table";

const ShortVideoPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams

    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 5;

    const res = await handleGetAllShortVideo(result, LIMIT)

    const data = res?.data

    const meta = {
        current: data?.meta?.current || 1,
        pageSize: data?.meta?.pageSize || 10,
        total: data?.meta?.total || 1,
    }

    return (
        <div>
            <ManageShortVideoTable dataSource={data?.result || []} meta={meta} />
        </div>
    )
}

export default ShortVideoPage