"use client";
import { ColumnsType } from "antd/es/table";

import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/utils";
import {
  DeleteTwoTone,
  FilterOutlined,
  FlagTwoTone,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import { handleFlagShortVideoAction } from "@/actions/manage.short.video.action";
import VideoCustomize from "../video/video.customize";
import ModalListReport from "../modal/modal.list.report";
import {
  handleDeleteReportVideoAction,
  handleListVideoReportAction,
} from "@/actions/manage.report.action";
import InputCustomize from "../input/input.customize";
import dayjs from "dayjs";
import TableCustomize from "../ticked-user/table/table.dashboard";
import DropdownCustomize from "../dropdown/dropdown.customize";

interface IProps {
  dataSource: IReport[];
  meta: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const ManageReportTable = (props: IProps) => {
  const { dataSource, meta } = props;
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [dataReport, setDataReport] = useState<IDataReport[] | []>([]);
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState<IReport[] | []>(dataSource);
  const [metaTable, setMetaTable] = useState(meta);
  const [filterReq, setFilterReq] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFlagVideo = async (record: IShortVideo) => {
    const res = await handleFlagShortVideoAction(record._id, !record.flag);
    if (res?.statusCode === 201) {
      notification.success({ message: res?.message });
    } else {
      notification.error({ message: res?.message });
    }
  };

  const handleDeleteReportVideo = async (id: string) => {
    const res = await handleDeleteReportVideoAction(id);
    if (res?.statusCode === 200) {
      notification.success({ message: res?.message });
    } else {
      notification.error({ message: res?.message });
    }
  };

    const dataFilter = [
      {
        value: "report_asc",
        title: "Reports ↑ (fewest first)", 
      },
      {
        value: "report_desc",
        title: "Reports ↓ (most first)", 
      },
      {
        value: "flagged",
        title: "Flagged", 
      },
      {
        value: "not_flagged",
        title: "Not Flagged", 
      },
      {
        value: "blocked",
        title: "Blocked", 
      },
      {
        value: "not_blocked",
        title: "Not Blocked", 
      },
    ];

  const handleGetReporttData=async() => {
        setIsLoading(true);
        if ((search.length > 0 || filterReq.length > 0)) {
        let res = await handleListVideoReportAction(meta.current, meta.pageSize, search, filterReq);
        if (res?.statusCode === 200) {
          if(res.data?.meta?.current>=1 && res.data?.meta?.total<=meta.pageSize){
            res=await handleListVideoReportAction(1, meta.pageSize, search, filterReq);
          }
          const mappedData = res?.data?.result
            ?.map((item: any) => {

                return {
                  _id: item._id,
                  dataVideo: {
                    _id: item.dataVideo._id,
                    videoUrl: item.dataVideo.videoUrl,
                    videoDescription: item.dataVideo.videoDescription,
                    videoThumbnail: item.dataVideo.videoThumbnail,
                    totalViews: item.dataVideo.totalViews || 0,
                    flag: item.dataVideo.flag || false,
                    userId: {
                      _id: item.dataVideo.userId._id,
                      userName: item.dataVideo.userId.userName,
                    },
                  },
                  total: item.total || 1,
                  dataReport: item.dataReport || [
                    {
                      userName: item.userId.userName,
                      reason: item.reasons,
                    },
                  ],
                };
            })
            .filter((item: any) => item !== null);

          setDataTable(mappedData || []);
          setMetaTable({
            current: res?.data?.meta?.current || 1,
            pageSize: res?.data?.meta?.pageSize || 10,
            total: res?.data?.meta?.total || 0,
          });
        } else {
          notification.error({ message: "Failed to fetch video reports." });
        }
      } else {
        setDataTable(dataSource);
        setMetaTable(meta);
      }
      setIsLoading(false);
  }

  useEffect(() => {
   handleGetReporttData();
  }, [search, dataSource, filterReq, metaTable.current]);


  const columns: ColumnsType<IReport> = [
    {
      title: "Creator",
      dataIndex: "dataVideo",
      key: "userName",
      render: (value, record) => <div>{record.dataVideo.userId.userName}</div>,
    },
    {
      title: "Video",
      dataIndex: "dataVideo",
      key: "videoThumbnail",
      render: (value: IShortVideo) => (
        <VideoCustomize
          videoThumbnail={value.videoThumbnail}
          videoUrl={value.videoUrl}
        />
      ),
    },
     {
            title: 'Description',
            dataIndex: 'dataVideo',
            key: 'videoDescription',
               render: (value, record) => <div>{record.dataVideo.videoDescription}</div>,
      },
    {
      title: "Views",
      dataIndex: "dataVideo",
      key: "totalViews",
      render: (value: IShortVideo) => (
        <div>{formatNumber(value.totalViews ?? 0)}</div>
      ),
    },
    {
      title: "Total Report",
      dataIndex: "total",
      key: "total",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Reasons",
      dataIndex: "dataReport",
      key: "dataReport",
      render: (value) => (
        <Tooltip
          overlayInnerStyle={{ background: "white", color: "#1e272e" }}
          title="Click here to show list report"
        >
          <Button
            onClick={() => {
              setIsReportModalOpen(true);
              setDataReport(value);
            }}
          >
            <UnorderedListOutlined />
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      dataIndex: "dataVideo",
      key: "flag",
      render: (value: IShortVideo) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Popconfirm
            title="Sure to flag video?"
            onConfirm={() => handleFlagVideo(value)}
            okText="Yes"
            cancelText="No"
          >
            <FlagTwoTone
              style={{ fontSize: "20px" }}
              twoToneColor={value.flag ? "#ff7675" : ""}
            />
          </Popconfirm>
          <Popconfirm
            title="Sure to delete video report?"
            onConfirm={() => handleDeleteReportVideo(value._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone
              style={{ fontSize: "20px" }}
              twoToneColor={"#ff7675"}
            />
          </Popconfirm>
        </div>
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
        <span>Manager Report Video</span>
      </div>
      <div style={{ width: "300px" }}>
        <div>
          <InputCustomize
            setValue={setSearch}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
        <div
          style={{ width: "130px", marginLeft: "310px", marginTop: "-32px" }}
        >
           <DropdownCustomize data={dataFilter} title="Filter" selected={filterReq} setSelect={setFilterReq} icon={<FilterOutlined />} />
        </div>
      </div>
      <TableCustomize
        columns={columns}
        dataSource={dataTable.map((item, index) => ({ ...item, _id:`report-${index}` }))}
        meta={metaTable}
        filterReq={filterReq}
        searchData={search}
        isLoadingProp={isLoading}
      />
      <ModalListReport
        data={dataReport}
        isModalOpen={isReportModalOpen}
        setIsModalOpen={setIsReportModalOpen}
      />  
    </>
  );
};

export default ManageReportTable;
