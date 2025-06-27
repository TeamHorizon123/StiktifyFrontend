"use client"    
import { ColumnsType } from "antd/es/table";
import { Button, MenuProps } from "antd";
import { FilterOutlined, MailTwoTone, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import CreateUserModal from "./create.user.model";
import UpdateUserModal from "./edit.user.modal";
import InputCustomize from "../input/input.customize";
import DropdownCustomize from "../dropdown/dropdown.customize";
import { handleFilterAndSearchAction } from "@/actions/manage.user.action";
import SendEmailModal from "./send.email.modal";
import { ActionManagerUser, FormatDateTime, StyleStatus } from "../ticked-user/table/user.render.table";
import TableCustomize from "../ticked-user/table/table.dashboard";
interface IProps {
    dataSource: IUser[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    },
    metaDefault: {
        current: number,
        LIMIT: number
    }
}

const ManageUserTable = (props: IProps) => {
    const { dataSource, meta, metaDefault } = props;
    const [dataTable, setDataTable] = useState<IUser[] | []>(dataSource)
    const [metaTable, setMetaTable] = useState(meta)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUser, setDataUser] = useState<IUser | null>(null)
    const [search, setSearch] = useState("")
    const [filterReq, setFilterReq] = useState("")

    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false)

    const dataFilter = [
            {
                value: "block",
                title: "Block"
            }, {
                value: "unblock",
                title: "Unblock"
            }, {
                value: "USERS",
                title: "Users"
            }, {
                value: "ADMIN",
                title: "Admin"
            },
    ]

    const handleMailClick = (record: any) => {
        setDataUser(record)
        setIsEmailModalOpen(true)
    };

    useEffect(() => {
        (async () => {
            if (search.length > 0 || filterReq.length > 0) {
                const res = await handleFilterAndSearchAction(metaDefault.current, metaDefault.LIMIT, search, filterReq)
                setDataTable(res?.data?.result)
                setMetaTable(res?.data?.meta)
            } else {
                setMetaTable(meta)
                setDataTable(dataSource)
            }
        })()


    }, [search, dataSource, filterReq, meta])

    const columns: ColumnsType<IUser> = [
        {
            title: 'Full name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Code',
            dataIndex: 'activeCode',
            key: 'activeCode',
        },
        {
            title: 'Code Expired',
            dataIndex: 'codeExpired',
            key: 'codeExpired',
            render: FormatDateTime
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: string) => StyleStatus({ value })
        },
        {
            title: 'Send Email',
            dataIndex: 'mail',
            key: 'mail',
            render: (value: boolean, record: IUser, index: number) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                    <MailTwoTone
                        style={{ fontSize: 16, color: "#1890ff" }}
                        onClick={() => handleMailClick(record)}
                    />                </div>
            )
        },
        {
            title: 'Action',
            dataIndex: 'isBan',
            key: 'isBan',
            render: (value: boolean, record: IUser, index: number) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                    {ActionManagerUser(value, record, index, setIsUpdateModalOpen, setDataUser)}
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
                <span>Manager Users</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserAddOutlined />
                    <span>Add New</span>
                </Button>
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
            <CreateUserModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
            <UpdateUserModal setDataUser={setDataUser} dataUser={dataUser} isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} />
            {isEmailModalOpen && <SendEmailModal user={dataUser} onClose={() => setIsEmailModalOpen(false)} />}
        </>
    )
}

export default ManageUserTable