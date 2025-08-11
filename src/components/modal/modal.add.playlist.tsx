"use client";

import { handleAddPlaylistAction } from "@/actions/playlist.action";
import { AuthContext } from "@/context/AuthContext";
import { useGlobalContext } from "@/library/global.context";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Modal,
  Input,
  Form,
  notification,
  UploadProps,
  Upload,
  Button,
} from "antd";
import { useContext, useState } from "react";

interface IProps {
  isOpenModal: boolean;
  setIsOpenModal: (v: boolean) => void;
}

const AddPlayList = (props: IProps) => {
  const { isOpenModal, setIsOpenModal } = props;
  const { accessToken, user } = useContext(AuthContext)!;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [urlUpload, setUrlUpload] = useState<string>("");
  const { setRefreshPlaylist, refreshPlaylist } = useGlobalContext()!;

  const handleCloseCreateModal = () => {
    form.resetFields();
    setUrlUpload(""); // Reset URL khi đóng modal
    setIsOpenModal(false);
  };

  // Hàm xóa ảnh đã upload
  const handleRemoveImage = () => {
    setUrlUpload("");
  };

  const onFinish = async (values: any) => {
    if (!values.description) values.description = "";
    const res = await handleAddPlaylistAction(
      user._id,
      values.name,
      values.description,
      urlUpload
    );
    if (res?.statusCode === 201) {
      setRefreshPlaylist(!refreshPlaylist);
      notification.success({ message: res?.message });
      form.resetFields();
      setIsOpenModal(false);
      setUrlUpload("");
      return;
    }
    notification.warning({ message: res?.message });
  };

  const propsUpload: UploadProps = {
    action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
    method: "POST",
    name: "file",
    listType: "picture-card",
    className: "avatar-uploader",
    maxCount: 1,
    accept: ".jpg,.jpeg,.png",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data: {
      folder: "playlist-thumbnail",
    },
    withCredentials: true,
    showUploadList: false, // Ẩn upload list mặc định
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setUrlUpload(info.file.response.data);
      } else if (info.file.status === "error") {
        notification.error({
          message: `${info.file.name} file upload failed.`,
        });
      }
    },
  };

  return (
    <>
      <Modal
        style={{ top: 50 }}
        styles={{
          mask: { backgroundColor: "111827" },
          content: {
            backgroundColor: "#111827",
            border: "1px solid #374151",
          },
          header: {
            backgroundColor: "#111827",
            borderBottom: "1px solid #374151",
            color: "white",
          },
          body: {
            backgroundColor: "#111827",
            padding: "20px",
          },
        }}
        title="New Playlist"
        open={isOpenModal}
        onOk={() => form.submit()}
        onCancel={() => handleCloseCreateModal()}
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={handleCloseCreateModal}
            style={{ background: "#6b7280", color: "#fff", border: "none" }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={() => form.submit()}
            style={{ background: "#816cdf", color: "#fff" }}
          >
            Create
          </Button>,
        ]}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          className="flex justify-center items-start gap-5"
        >
          {/* Phần Upload Ảnh */}
          <div className="flex flex-col items-center">
            {urlUpload && urlUpload.length > 0 ? (
              <div className="relative">
                <img
                  src={urlUpload}
                  alt="playlist thumbnail"
                  className="rounded-md shadow-md object-cover"
                  style={{ width: "200px", height: "200px" }}
                />
                {/* Nút xóa ảnh */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <Upload {...propsUpload}>
                <button
                  style={{
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  type="button"
                >
                  {loading ? (
                    <LoadingOutlined style={{ fontSize: 24 }} />
                  ) : (
                    <PlusOutlined style={{ fontSize: 24 }} />
                  )}
                  <div style={{ marginTop: 8, color: "#6b7280" }}>
                    Upload Image
                  </div>
                </button>
              </Upload>
            )}
          </div>

          {/* Phần Form Input */}
          <div className="flex-1">
            <Form.Item
              label={
                <span style={{ color: "white", fontWeight: "500" }}>
                  Name Playlist
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Please input name playlist!" }]}
            >
              <Input
                type="text"
                style={{
                  backgroundColor: "#374151",
                  color: "#1f2937",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px 12px",
                }}
              />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: "white", fontWeight: "500" }}>
                  Description
                </span>
              }
              name="description"
            >
              <Input
                style={{
                  backgroundColor: "#374151",
                  color: "#1f2937",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  resize: "vertical",
                }}
              />
            </Form.Item>
          </div>
        </Form>

      </Modal>
      <style jsx global>{`
      .ant-modal-content {
        background-color: #111827 !important;
        color: white !important;
      }
      .ant-modal-title {
        color: white !important;
      }
      .ant-modal-close-icon {
        color: white !important;
      }
      .ant-btn {
        border-color: #4b5563 !important;
        color: white !important;
      }
      .ant-btn-primary {
        background-color: #8b5cf6 !important; /* purple-500 */
        border-color: #8b5cf6 !important;
      }
      .ant-btn-primary:hover {
        background-color: #a78bfa !important; /* purple-400 */
        border-color: #a78bfa !important;
      }
    `}</style>
    </>

  );
};

export default AddPlayList;
