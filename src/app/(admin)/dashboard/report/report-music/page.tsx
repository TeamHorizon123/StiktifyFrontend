import { handleGetAllReportMusicAction } from "@/actions/manage.report.action";
import ManageReportMusicTable from "@/components/admin/report.music.table";

const MusicReportPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams

    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 5;

    const res = await handleGetAllReportMusicAction(result, LIMIT)

    const data = res?.data

    const meta = {
        current: data?.meta?.current || 1,
        pageSize: data?.meta?.pageSize || 10,
        total: data?.meta?.total || 1,
    }

    return (
        <div>
            <ManageReportMusicTable dataSource={data?.result || []} meta={meta} />
        </div>
    )
}

export default MusicReportPage