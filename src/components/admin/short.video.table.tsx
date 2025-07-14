"use client";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { formatDateTimeVn, formatNumber } from "@/utils/utils";
import {
  FilterOutlined,
  FlagTwoTone,
  LockTwoTone,
  SearchOutlined,
  UnlockTwoTone,
} from "@ant-design/icons";
import { notification, Popconfirm } from "antd";
import {
  handleBlockShortVideoAction,
  handleFlagShortVideoAction,
  handleGetAllShortVideo,
} from "@/actions/manage.short.video.action";
import InputCustomize from "../input/input.customize";
import DropdownCustomizeFilterVideo from "../dropdown/dropdownFilterVide";

import VideoCustomize from "../video/video.customize";
import TableCustomize from "../ticked-user/table/table.dashboard";

interface IProps {
  dataSource: IShortVideo[];
  meta: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const ManageShortVideoTable = (props: IProps) => {
  const { dataSource, meta } = props;
  const [dataTable, setDataTable] = useState<IShortVideo[]>(dataSource);
  const [metaTable, setMetaTable] = useState(meta);
  const [search, setSearch] = useState<string>("");
  const [filterReq, setFilterReq] = useState<string>("");
  const [forceRender, setForceRender] = useState<number>(0);

  const handleFlagVideo = async (record: IShortVideo) => {
    const res = await handleFlagShortVideoAction(record._id, !record.flag);
    notification.success({ message: res?.message });
  };

  const handleBlockVideo = async (record: IShortVideo) => {
    const res = await handleBlockShortVideoAction(record._id, !record.isBlock);
    notification.success({ message: res?.message });
  };

  useEffect(() => {
    (async () => {
      if (search.length > 0 || filterReq.length > 0) {
        if (search.length > 0) {
          let res = await handleGetAllShortVideo(
            search,
            filterReq,
            meta.current,
            meta.pageSize
          );
            if(res?.data?.meta?.current>=1 && res?.data?.meta?.total<=meta.pageSize){
               res=await handleGetAllShortVideo(search, filterReq, 1, meta.pageSize);
            }
          if (res?.data?.result && Array.isArray(res.data.result)) {
            const sortedVideos = [...res.data.result].sort((a, b) => {
              const aMatch = a.videoDescription
                ?.toLowerCase()
                .includes(search.toLowerCase())
                ? 1
                : 0;
              const bMatch = b.videoDescription
                ?.toLowerCase()
                .includes(search.toLowerCase())
                ? 1
                : 0;
              return bMatch - aMatch;
            });

            setDataTable(sortedVideos);
            setMetaTable(res.data.meta);
          } else {
            setDataTable(dataSource);
            setMetaTable(meta);
          }
        } else if (filterReq.length > 0) {
          let res = await handleGetAllShortVideo(
            search,
            filterReq,
            meta.current,
            meta.pageSize
          );
           if(res?.data?.meta?.current>=1 && res?.data?.meta?.total<=meta.pageSize){
               res=await handleGetAllShortVideo(search, filterReq, 1, meta.pageSize);
            }
          if (res?.statusCode === 200) {
            setDataTable(res.data.result);
            setMetaTable(res.data.meta);
          }
        }
      } else {
        setDataTable(dataSource);
        setMetaTable(meta);
      }
    })();
  }, [search, filterReq, dataSource, meta]);

  const columns: ColumnsType<IShortVideo> = [
    {
      title: "Creator",
      dataIndex: "userId",
      key: "userId",
      render: (value) => {
        return <div>{value?.userName ?? "Unknown"}</div>;
      },
    },
    {
      title: "Thumbnail",
      dataIndex: "videoThumbnail",
      key: "videoThumbnail",
      render: (value: IShortVideo, record) => (
        <VideoCustomize
          videoThumbnail={record.videoThumbnail}
          videoId={record._id}
        />
      ),
    },
     {
      title: "Description",
      dataIndex: "videoDescription",
      key: "videoDescription",
    },
    {
      title: "Views",
      dataIndex: "totalViews",
      key: "totalViews",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
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
          onConfirm={() => handleBlockVideo(record)}
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
      title: "Action",
      dataIndex: "flag",
      key: "flag",
      render: (value, record) => (
        <Popconfirm
          title={`Sure to ${ value?"UnFlag":"Flag"} video?`}
          onConfirm={() => handleFlagVideo(record)}
          okText="Yes"
          cancelText="No"
        >
          <FlagTwoTone
            style={{ fontSize: "20px" }}
            twoToneColor={value ? "#ff7675" : ""}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        <span>Manager Short Video</span>
      </div>

      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "start",
          gap: 10,
        }}
      >
        <div style={{ width: "300px" }}>
          <InputCustomize
            setValue={(val: any) => {
              setSearch(val);
            }}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
        <div>
          <DropdownCustomizeFilterVideo
            title="Filter"
            selected={filterReq}
            setSelect={(value: any) => setFilterReq(value)} // Cập nhật giá trị filterReq khi thay đổi
            icon={<FilterOutlined />}
          />
        </div>
      </div>
      <TableCustomize
        columns={columns}
        dataSource={dataTable} // Đảm bảo dataTable được cập nhật đúng
        meta={metaTable} // Cập nhật meta nếu cần thiết
      />
    </>
  );
};

export default ManageShortVideoTable;
