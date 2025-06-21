import { handleGetAllReportAction } from "@/actions/manage.report.action";
import ManageReportTable from "@/components/admin/report.video.table";

const ShortVideoPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams

    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 5;

    const res = await handleGetAllReportAction(result, LIMIT)

    const data = res?.data

    const meta = {
        current: data?.meta?.current || 1,
        pageSize: data?.meta?.pageSize || 10,
        total: data?.meta?.total || 1,
    }

    return (
        <div>
            <ManageReportTable dataSource={data?.result || []} meta={meta} />
        </div>
    )
}

export default ShortVideoPage