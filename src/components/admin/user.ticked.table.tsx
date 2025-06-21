"use client";

import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Tooltip, Popconfirm, Avatar, notification } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useShowComment } from "@/context/ShowCommentContext";
import {
  handleAcceptUserTickedAction,
  handleFilterAndSearchUserRequest,
} from "@/actions/manage.user.ticked.action";
import RejectTickModal from "../modal/modal.reject.ticked";
import InputCustomize from "../input/input.customize";
import DropdownCustomize from "../dropdown/dropdown.customize";
import TableCustomize from "../ticked-user/table/table.dashboard";

interface IProps {
  dataSource: ITicked[];
  meta: {
    current: number;
    pageSize: number;
    total: number;
  };
  metaDefault: {
    current: number;
    LIMIT: number;
  };
}

const ManageUserTickedTable = (props: IProps) => {
  const { dataSource, meta, metaDefault } = props;
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const router = useRouter();
  const { setShowComments } = useShowComment();
  const [search, setSearch] = useState("");
  const [filterReq, setFilterReq] = useState("");
  const [dataTable, setDataTable] = useState<ITicked[] | []>(dataSource);
  const [metaTable, setMetaTable] = useState(meta);

  const dataFilter = [
    {
      value: "pending",
      title: "Pending",
    },
    {
      value: "approved",
      title: "Approved",
    },
    {
      value: "rejected",
      title: "Rejected",
    },
  ];

  const handleAcceptUserTicked = async (id: string) => {
    const res = await handleAcceptUserTickedAction(id);
    if (res?.success) {
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
  };

  const handleRejectClick = (record: any) => {
    setSelectedUser(record);
    setIsEmailModalOpen(true);
  };

  useEffect(() => {
    (async () => {
      if (search.length > 0 || filterReq.length > 0) {
        const res = await handleFilterAndSearchUserRequest(
          metaDefault.current,
          metaDefault.LIMIT,
          search,
          filterReq
        );
        if (res?.data) {
          setDataTable(res?.data?.result);
          setMetaTable(res?.data?.meta);
        }
      } else {
        setMetaTable(meta);
        setDataTable(dataSource);
      }
    })();
  }, [search, filterReq, dataSource, meta]);

  const columns: ColumnsType = [
    {
      title: "Username",
      dataIndex: "userData",
      key: "userName",
      render: (value, record) => <div>{record.userData.userName}</div>,
    },
    {
      title: "Email",
      dataIndex: "userData",
      key: "email",
      render: (value, record) => <div>{record.userData.email}</div>,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (value, record) => (
        <Tooltip title="Click to view details">
          <Avatar
            src={
              record.userData.image ||
              "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
            }
            size="small"
            onClick={() => {
              setShowComments(true);
              router.push(`/page/detail_user/${record.userData._id}`);
            }}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (value, record) => <div>{record.tickedRequests[0].status}</div>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "action",
      render: (value, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Tooltip title="Approve">
            <Popconfirm
              title="Sure to approve this request?"
              onConfirm={() =>
                handleAcceptUserTicked(record.tickedRequests[0].id)
              }
              okText="Yes"
              cancelText="No"
            >
              <CheckCircleTwoTone
                style={{ fontSize: "20px", cursor: "pointer" }}
                twoToneColor="#2ecc71"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Reject">
            <Popconfirm
              title="Sure to reject this request?"
              onConfirm={() => handleRejectClick(record)}
              okText="Yes"
              cancelText="No"
            >
              <CloseCircleTwoTone
                style={{ fontSize: "20px", cursor: "pointer" }}
                twoToneColor="#e74c3c"
              />
            </Popconfirm>
          </Tooltip>
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
        <span>Manage ticked users</span>
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
            setValue={setSearch}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
        <div>
          <DropdownCustomize
            data={dataFilter}
            title="Filter"
            selected={filterReq}
            setSelect={setFilterReq}
            icon={<FilterOutlined />}
          />
        </div>
      </div>
      <TableCustomize
        columns={columns}
        dataSource={dataTable}
        meta={metaTable}
      />
      {isEmailModalOpen && selectedUser && (
        <RejectTickModal
          tickedUser={selectedUser}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </>
  );
};

export default ManageUserTickedTable;
