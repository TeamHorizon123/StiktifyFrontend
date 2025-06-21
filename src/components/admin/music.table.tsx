"use client"
import { ColumnsType } from "antd/es/table";
import { Popconfirm } from "antd";
import { FilterOutlined, FlagTwoTone, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import InputCustomize from "../input/input.customize";
import DropdownCustomize from "../dropdown/dropdown.customize";
import TagMusic from "../music/tag.music";
import { formatNumber } from "@/utils/utils";
import { handleFilterAndSearchMusicAction } from "@/actions/music.action";
import TableCustomize from "../ticked-user/table/table.dashboard";
interface IProps {
    dataSource: IMusic[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    },
    metaDefault: {
        current: number,
        LIMIT: number
    },
    dataFilter: { value: string, title: string }[] | []
}

const ManageMusicTable = (props: IProps) => {
    const { dataSource, meta, metaDefault, dataFilter } = props;
    const [dataTable, setDataTable] = useState<IMusic[] | []>(dataSource)
    const [metaTable, setMetaTable] = useState(meta)
    const [search, setSearch] = useState("")
    const [filterReq, setFilterReq] = useState("")


    useEffect(() => {
        (async () => {
            if (search.length > 0 || filterReq.length > 0) {
                const res = await handleFilterAndSearchMusicAction(metaDefault.current, metaDefault.LIMIT, search, filterReq)
                setDataTable(res?.data?.result)
                setMetaTable(res?.data?.meta)
            } else {
                setMetaTable(meta)
                setDataTable(dataSource)
            }
        })()
    }, [search, dataSource, filterReq, meta])

    const columns: ColumnsType<IMusic> = [
        {
            title: 'Name',
            dataIndex: 'musicDescription',
            key: 'musicDescription',
        },
        {
            title: 'Music',
            dataIndex: 'musicThumbnail',
            key: 'musicThumbnail',
            render: (value, record, index) => (
                <div className="w-64 h-20  bg-gray-900/80  rounded-md flex px-2 mx-1">
                    <TagMusic isOnPlayMusic={true} className=" text-[18px]" animationText={false} item={record} onClick={() => { }} />
                </div>
            ),
        },
        {
            title: 'Listeners',
            dataIndex: 'totalListener',
            key: 'totalListener',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Favorites',
            dataIndex: 'totalFavorite',
            key: 'totalFavorite',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Reactions',
            dataIndex: 'totalReactions',
            key: 'totalReactions',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Action',
            dataIndex: 'flag',
            key: 'flag',
            render: (value, record, index) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Popconfirm
                        title="Sure to flag video?"
                        onConfirm={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FlagTwoTone
                            style={{ fontSize: "20px" }}
                            twoToneColor={value ? "#ff7675" : ""} />
                    </Popconfirm>
                </div>
            )
        }

    ];


    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                fontWeight: 600,
                fontSize: 20
            }}>
                <span>Manager Musics</span>
                {/* <Button onClick={() => { }}>
                    <UserAddOutlined />
                    <span>Add New</span>
                </Button> */}
            </div >
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "start", gap: 10 }}>
                <div style={{ width: "300px" }}>
                    <InputCustomize setValue={setSearch} value={search} icon={<SearchOutlined />} />
                </div>
                <div>
                    <DropdownCustomize data={dataFilter} title="Filter" selected={filterReq} setSelect={setFilterReq} icon={<FilterOutlined />} />
                </div>
            </div>
            <TableCustomize columns={columns} dataSource={dataTable} meta={metaTable} />
        </>
    )
}

export default ManageMusicTable