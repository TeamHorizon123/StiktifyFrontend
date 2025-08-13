"use client";

import {
    Modal,
    Form,
    Input,
    Button,
    Upload,
    Select,
    notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import { handleUpdateMusic } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";

interface ICategory {
    _id: string;
    categoryName: string;
}

interface UpdateMusicProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    initialData: {
        musicId: string;
        musicDescription: string;
        musicThumbnail: string;
        categoryId?: ICategory[];
    };
    tagOptions?: { label: string; value: string }[];
    listCate?: ICategory[];
    refreshList?: () => void;
}

const UpdateMusicModal = ({
    isOpen,
    setIsOpen,
    initialData,
    refreshList,
}: UpdateMusicProps) => {
    const [form] = Form.useForm();
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData.musicThumbnail);
    const [listCateChoose, setListCateChoose] = useState<ICategory[]>([]);
    const { accessToken, user } = useContext(AuthContext)!



    useEffect(() => {
        form.setFieldValue("musicDescription", initialData.musicDescription);
        setListCateChoose(initialData.categoryId || []);
        setThumbnailUrl(initialData.musicThumbnail);
    }, [initialData]);

    const checkChoose = (id: string): boolean => {
        return listCateChoose.some((item) => item._id === id);
    };

    const handleAddCateChoose = (item: ICategory) => {
        if (!checkChoose(item._id)) {
            setListCateChoose((prev) => [...prev, item]);
        } else {
            setListCateChoose((prev) => prev.filter((x) => x._id !== item._id));
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {


        const payload = {
            musicId: initialData.musicId,
            musicDescription: values.musicDescription,
            musicThumbnail: thumbnailUrl,
        };

        const res = await handleUpdateMusic(payload);
        console.log("RES >>>", res);

        if (res?.statusCode === 201) {
            notification.success({ message: "Updated successfully!" });
            setIsOpen(false);
            refreshList?.();
        } else {
            notification.error({ message: res?.message || "Failed to update" });
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            okText="Update"
            title={<div style={{ color: "white", fontWeight: 600, backgroundColor: "#111827" }}>Update Music</div>}
            style={{
                backgroundColor: "#111827", // modal border
                borderRadius: 12,
                borderColor: "#111827"
            }}
            bodyStyle={{
                backgroundColor: "#111827",
                color: "white",
            }}
            okButtonProps={{
                style: {
                    backgroundColor: "#8B5CF6", // purple-500
                    borderColor: "#8B5CF6",
                    color: "white",
                },
                onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = "#A78BFA"; // purple-400
                    e.currentTarget.style.borderColor = "#A78BFA";
                },
                onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = "#8B5CF6";
                    e.currentTarget.style.borderColor = "#8B5CF6";
                },
            }}
            cancelButtonProps={{
                style: {
                    backgroundColor: "transparent",
                    borderColor: "#4B5563", // gray-600
                    color: "white",
                },
            }}
        >

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="musicDescription"
                    label={<span style={{ color: "white" }}>Title</span>}
                    rules={[{ required: true, message: "Please enter title" }]}
                >
                    <Input
                        placeholder="Enter music title..."
                        style={{
                            backgroundColor: "#1f2937", // darker input
                            color: "white",
                            borderColor: "#374151",
                        }}
                    />
                </Form.Item>

                <Form.Item label={<span style={{ color: "white" }}>Thumbnail</span>}>
                    <Upload
                        name="file"
                        maxCount={1}
                        accept="image/*"
                        action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`}
                        headers={{ authorization: `Bearer ${accessToken}` }}
                        data={{ folder: "thumbnail" }}
                        onChange={(info) => {
                            if (info.file.status === "done") {
                                setThumbnailUrl(info.file.response.data);
                            }
                        }}
                    >
                        <Button
                            icon={<UploadOutlined />}
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#6B7280",
                                color: "white",
                            }}
                        >
                            Upload New Thumbnail
                        </Button>
                    </Upload>
                    {thumbnailUrl && (
                        <img
                            src={thumbnailUrl}
                            alt="thumbnail"
                            className="mt-2 rounded-md"
                            style={{ width: 100 }}
                        />
                    )}
                </Form.Item>
            </Form>
            <style global jsx>{`
  :where(.ant-modal) .ant-modal-content {
    background-color: #111827 !important;
    color: #fff !important;
  }
`}</style>
        </Modal>
    );
};

export default UpdateMusicModal;
