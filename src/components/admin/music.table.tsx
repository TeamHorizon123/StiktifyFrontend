"use client"
import { ColumnsType } from "antd/es/table";
import { notification, Popconfirm } from "antd";
import { FilterOutlined, FlagTwoTone, LockTwoTone, SearchOutlined, UnlockTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import InputCustomize from "../input/input.customize";
import DropdownCustomize from "../dropdown/dropdown.customize";
import TagMusic from "../music/tag.music";
import { formatDateTimeVn, formatNumber } from "@/utils/utils";
import { handleFilterAndSearchMusicAction } from "@/actions/music.action";
import TableCustomize from "../ticked-user/table/table.dashboard";
import { handleBlockMusicAction, handleFlagMusicAction } from "@/actions/manage.report.action";
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

      const handleFlagMusic = async (record: IMusic) => {
        const res = await handleFlagMusicAction(record._id, !record.flag);
        if (res?.statusCode === 201) {
          return notification.success({ message: res?.message });
        }
        return notification.error({ message: res?.message });
      };
      
      
      const handleBlockMusic = async (record: IMusic) => {
        const res = await handleBlockMusicAction(record._id, !record.isBlock);
        if (res?.statusCode === 201) {
          return notification.success({ message: res?.message });
        }
        return notification.error({ message: res?.message });
      };

    useEffect(() => {
        (async () => {
            if (search.length > 0 || filterReq.length > 0) {
                let res = await handleFilterAndSearchMusicAction(metaDefault.current, metaDefault.LIMIT, search, filterReq)
                  if(res?.data?.meta?.current>=1 && res?.data?.meta?.total<=meta.pageSize){
                      res=await handleFilterAndSearchMusicAction(1, metaDefault.LIMIT, search, filterReq);
                }
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
            title: "Creator",
            dataIndex: "userId",
            key: "userId",
            render: (value) => {
                return <div>{value?.userName ?? "Unknown"}</div>;
            },
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
            title: 'Description',
            dataIndex: 'musicDescription',
            key: 'musicDescription',
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
              title: "Comments",
              dataIndex: "totalComment",
              key: "totalComment",
              render: (value) => <div>{formatNumber(value ?? 0)}</div>,
        },
        {
            title: "Blocked",
            key: "isBlock",
            render: (_, record) => (
            <Popconfirm
                title={`Sure to ${record?.isBlock?"UnBlock":"Block"} video?`}
                onConfirm={() => handleBlockMusic(record)}
                okText="Yes"
                cancelText="No"
                >
            {record?.isBlock ? (
                <LockTwoTone style={{ fontSize: "24px" }} twoToneColor="#d63031" />
                ) : (
                <UnlockTwoTone style={{ fontSize: "24px" }} twoToneColor="#00b894" />
                )}
            </Popconfirm>
            ),
        },
     {
              title: "Created At",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (value) => <div>{value?formatDateTimeVn(value+""):""}</div>,
            },
        {
            title: 'Action',
            key: 'action',
            render: (value, record, index) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Popconfirm
                        title={`Sure to ${ value?.flag?"UnFlag":"Flag"} music?`}
                        onConfirm={() => handleFlagMusic(value)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FlagTwoTone
                            style={{ fontSize: "20px" }}
                            twoToneColor={value?.flag ? "#ff7675" : ""} />
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