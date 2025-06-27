"use client";
import { ColumnsType } from "antd/es/table";

import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/utils";
import {
  DeleteTwoTone,
  FlagTwoTone,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import { handleFlagShortVideoAction } from "@/actions/manage.short.video.action";
import VideoCustomize from "../video/video.customize";
import ModalListReport from "../modal/modal.list.report";
import {
  handleDeleteReportVideoAction,
  handleSearchVideoReportAction,
} from "@/actions/manage.report.action";
import InputCustomize from "../input/input.customize";
import dayjs from "dayjs";
import TableCustomize from "../ticked-user/table/table.dashboard";

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
  const [startDate, setStartDate] = useState<string | undefined>(undefined);

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

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (Array.isArray(dateString)) {
      setStartDate(dateString[0]);
    } else {
      setStartDate(dateString); 
    }
  };

  useEffect(() => {
    (async () => {
      if (search.length > 0 || startDate) {
        const res = await handleSearchVideoReportAction(search, startDate);
        if (res?.statusCode === 200) {
          if (res.data?.result?.length === 0) {
            notification.info({
              message: startDate
                ? `No reports found for ${startDate}.`
                : "No reports found for the search term.",
            });
          }
          const mappedData = res.data?.result
            ?.map((item: any) => {
              const reportDate = item.reportDate
                ? dayjs(item.reportDate)
                : null;
              const isDateMatch = startDate
                ? reportDate &&
                  reportDate.isSame(dayjs(startDate, "YYYY-MM-DD"), "day")
                : true;
              if (isDateMatch) {
                return {
                  _id: item._id,
                  dataVideo: {
                    _id: item.videoId._id,
                    videoUrl: item.videoId.videoUrl,
                    videoDescription: item.videoId.videoDescription,
                    videoThumbnail: item.videoId.videoThumbnail,
                    totalViews: item.videoId.totalViews || 0,
                    flag: item.videoId.flag || false,
                    userId: {
                      _id: item.videoId.userId._id,
                      userName: item.videoId.userId.userName,
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
              }
              return null;
            })
            .filter((item: any) => item !== null);

          setDataTable(mappedData || []);
          setMetaTable({
            current: res.data?.meta?.current || 1,
            pageSize: res.data?.meta?.pageSize || 10,
            total: res.data?.meta?.total || 0,
          });
        } else {
          notification.error({ message: "Failed to fetch video reports." });
        }
      } else {
        setDataTable(dataSource);
        setMetaTable(meta);
      }
    })();
  }, [search, startDate, dataSource]);

  useEffect(() => {
    console.log("Data table updated:", dataTable);
    console.log("Meta table updated:", metaTable);
  }, [search, dataSource, meta]);

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
          <DatePicker
            onChange={onChange}
            value={startDate ? dayjs(startDate, "YYYY-MM-DD") : null}
          />
        </div>
      </div>
      <TableCustomize
        columns={columns}
        dataSource={dataTable}
        meta={metaTable}
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
