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
import ModalListReport from "../modal/modal.list.report";
import {
  handleDeleteReportMusicAction,
  handleFlagMusicAction,
  handleGetAllReportMusicAction,
} from "@/actions/manage.report.action";
import TagMusic from "../music/tag.music";
import InputCustomize from "../input/input.customize";
import TableCustomize from "../ticked-user/table/table.dashboard";
import DropdownCustomize from "../dropdown/dropdown.customize";

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
  const [filterReq, setFilterReq] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFlagMusic = async (record: IMusic) => {
    const res = await handleFlagMusicAction(record._id, !record.flag);
    if (res?.statusCode === 201) {
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
  };

  const handleDeleteReportVideo = async (id: string) => {
    const res = await handleDeleteReportMusicAction(id);
    if (res?.statusCode === 200) {
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
  };


  const handleGetReporttData = async () => {
    setIsLoading(true);
    if (search.length > 0 || filterReq.length > 0) {
      let res = await handleGetAllReportMusicAction(meta.current, meta.pageSize, search, filterReq);
      if (res?.statusCode === 200) {
        if (res.data?.meta?.current >= 1 && res.data?.meta?.total <= meta.pageSize) {
          res = await handleGetAllReportMusicAction(1, meta.pageSize, search, filterReq);
        }
        const mappedData = res?.data?.result?.map((item: any) => ({
          _id: item._id,
          dataMusic: {
            _id: item.dataMusic._id,
            musicUrl: item.dataMusic.musicUrl,
            musicDescription: item.dataMusic.musicDescription,
            musicThumbnail: item.dataMusic.musicThumbnail,
            totalListener: item.dataMusic.totalViews || 0,
            flag: item.dataMusic.flag || false,
            userId: {
              _id: item.dataMusic.userId._id,
              userName: item.dataMusic.userId.userName,
            },
          },
          total: item.total || 1,
          dataReport: [
            {
              userName: item.dataMusic.userName,
              reason: item.reasons,
            },
          ],
        })).filter((item: any) => item !== null);
        setDataTable(mappedData || []);
        setMetaTable({
          current: res?.data?.meta?.current || 1,
          pageSize: res?.data?.meta?.pageSize || 10,
          total: res?.data?.meta?.total || 0,
        });
      } else {
        notification.error({ message: "Failed to fetch reports." });
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

  const columns: ColumnsType<IReportMusic> = [
    {
      title: "Creator",
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
            onClick={() => { }}
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
              okButtonProps={{
                className: '!bg-blue !text-white'
              }}
            >
              <FlagTwoTone
                style={{ fontSize: "20px" }}
                twoToneColor={value?.flag ? "#ff7675" : ""}
              />
            </Popconfirm>
            <Popconfirm
              title="Sure to delete music report?"
              onConfirm={() => handleDeleteReportVideo(value._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                className: '!bg-blue !text-white'
              }}
            >
              <DeleteTwoTone
                style={{ fontSize: "20px" }}
                twoToneColor={"#ff7675"}
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
          <DropdownCustomize data={dataFilter} title="Filter" selected={filterReq} setSelect={setFilterReq} icon={<FilterOutlined />} />
        </div>
      </div>
      <TableCustomize
        columns={columns}
        dataSource={dataTable.map((item, index) => ({ ...item, _id: `report-${index}` }))}
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

export default ManageReportMusicTable;
