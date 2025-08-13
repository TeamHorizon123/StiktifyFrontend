"use client"
import { handleBanUserAction, handleUnBanUserAction } from "@/actions/manage.user.action"
import { formatDateTime } from "@/utils/utils"
import { FileSearchOutlined, LockTwoTone, SmileOutlined, UnlockTwoTone } from "@ant-design/icons"
import { notification, Popconfirm } from "antd"

export const ActionManagerUser = (value: any, record: IUser, index: any, setIsUpdateModalOpen: (v: boolean) => void, setDataUser: (v: IUser) => void) => {

    const handleBanUser = async (id: string, isBan: boolean) => {
        const res = await handleBanUserAction(id, isBan)
        notification.success({ message: res?.message })
    }


    return (
        <>
            <div style={{ display: "flex", gap: 20, justifyContent: "start" }}>
                <FileSearchOutlined twoToneColor={"#636e72"}
                    style={{ fontSize: 20, opacity: 0.7 }}
                    onClick={() => {
                        setIsUpdateModalOpen(true);
                        setDataUser(record)
                    }} />
                {value ?
                    <Popconfirm
                        title="Are you sure unlock this user?"
                        onConfirm={() => handleBanUser(record._id, !record.isBan)}
                        okText="Yes"
                        cancelText="No"
                    >

                        <LockTwoTone
                            twoToneColor={"#ff7675"}
                            style={{ fontSize: 20 }}
                        />
                    </Popconfirm>
                    :
                    <Popconfirm
                        title="Are you sure block this user?"
                        onConfirm={() => handleBanUser(record._id, !record.isBan)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                            className:'!bg-blue !text-white'
                        }}
                    >
                        <UnlockTwoTone
                            style={{ fontSize: 20 }}
                        />


                    </Popconfirm>
                }
            </div>
        </>
    )
}

export const FormatDateTime = (value: string) => {
    return formatDateTime(value);
}


interface StyleStatusProps {
    value: string;
}
export const StyleStatus = ({ value }: StyleStatusProps) => {
    return (
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 7 }}>
            {value?.toLowerCase() === "online" ?
                <>
                    <SmileOutlined style={{ color: "#78e08f", fontWeight: 600, fontSize: 20 }} />
                    <div style={{ textTransform: "uppercase", color: "#78e08f", fontWeight: 400, fontSize: 15 }}>{value}</div>
                </>
                :
                <>
                    <SmileOutlined rotate={180} style={{ color: "#d0d0d0d0", fontWeight: 600, fontSize: 20 }} />
                    <div style={{ textTransform: "uppercase", color: "#d0d0d0d0", fontWeight: 400, fontSize: 15 }}>{value}</div>
                </>
            }
        </div>
    )
}