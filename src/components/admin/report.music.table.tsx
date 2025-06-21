"use client";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/utils";
import {
  CalendarOutlined,
  DeleteTwoTone,
  FlagTwoTone,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Image,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import VideoCustomize from "../video/video.customize";
import ModalListReport from "../modal/modal.list.report";
import {
  handleDeleteReportVideoAction,
  handleFlagMusicAction,
  handleSearchMusicReportAction,
} from "@/actions/manage.report.action";
import TagMusic from "../music/tag.music";
import InputCustomize from "../input/input.customize";
import dayjs from "dayjs"; // Thay moment bằng dayjs
import TableCustomize from "../ticked-user/table/table.dashboard";

interface IProps {
  dataSource: IReportMusic[];
  meta: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const ManageReportMusicTable = (props: IProps) => {
  const { dataSource, meta } = props;
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [dataReport, setDataReport] = useState<IDataReport[] | []>([]);
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState<IReportMusic[] | []>(dataSource);
  const [metaTable, setMetaTable] = useState(meta);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);

  const handleFlagMusic = async (record: IMusic) => {
    const res = await handleFlagMusicAction(record._id, !record.flag);
    if (res?.statusCode === 201) {
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
  };

  const handleDeleteReportVideo = async (id: string) => {
    const res = await handleDeleteReportVideoAction(id);
    if (res?.statusCode === 200) {
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
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
        const res = await handleSearchMusicReportAction(search, startDate);
        if (res?.statusCode === 200) {
          if (res.data?.result?.length === 0) {
            notification.info({
              message: startDate
                ? `No reports found for ${startDate}.`
                : "No reports found for the search term.",
            });
          }
          const mappedData = res.data?.result?.map((item: any) => ({
            _id: item._id,
            dataMusic: {
              _id: item.musicId._id,
              musicUrl: item.musicId.musicUrl,
              musicDescription: item.musicId.musicDescription,
              musicThumbnail: item.musicId.musicThumbnail,
              totalListener: 0,
              flag: false,
              userId: {
                _id: item.musicId.userId._id,
                userName: item.musicId.userId.userName,
              },
            },
            total: 1,
            dataReport: [
              {
                userName: item.userId.userName,
                reason: item.reasons,
              },
            ],
          }));
          setDataTable(mappedData || []);
        } else {
          notification.error({ message: "Failed to fetch reports." });
        }
      } else {
        setDataTable(dataSource);
      }
    })();
  }, [search, dataSource, startDate]);

  const columns: ColumnsType<IReportMusic> = [
    {
      title: "Username",
      dataIndex: "dataMusic",
      key: "userName",
      render: (value, record, index) => (
        <div>{record.dataMusic.userId.userName}</div>
      ),
    },
    {
      title: "Music",
      dataIndex: "dataMusic",
      key: "music",
      render: (value: IMusic, record, index) => (
        <div className="w-64 h-20 bg-gray-900/80 rounded-md flex px-2 mx-1">
          <TagMusic
            isOnPlayMusic={true}
            className=" text-[18px]"
            animationText={false}
            item={value}
            onClick={() => {}}
          />
        </div>
      ),
    },
    {
      title: "Listeners",
      dataIndex: "dataMusic",
      key: "listening",
      render: (value: IMusic, record, index) => (
        <div>{formatNumber(value.totalListener ?? 0)}</div>
      ),
    },
    {
      title: "Total Report",
      dataIndex: "total",
      key: "total",
      render: (value, record, index) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Reasons",
      dataIndex: "dataReport",
      key: "dataReport",
      render: (value, record, index) => (
        <>
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
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "dataMusic",
      key: "flag",
      render: (value: IMusic, record, index) => {
        return (
          <div style={{ display: "flex", gap: 10 }}>
            <Popconfirm
              title="Sure to flag music?"
              onConfirm={() => handleFlagMusic(value)}
              okText="Yes"
              cancelText="No"
            >
              <FlagTwoTone
                style={{ fontSize: "20px" }}
                twoToneColor={value?.flag ? "#ff7675" : ""}
              />
            </Popconfirm>
          </div>
        );
      },
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
        <span>Manager Report Music</span>
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

export default ManageReportMusicTable;
