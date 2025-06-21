"use client"

import { handleAddPlaylistAction } from '@/actions/playlist.action';
import { AuthContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/library/global.context';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Modal, Input, Form,
    notification,
    UploadProps,

    Upload,
    Button,
} from 'antd';
import { useContext, useState } from 'react';

interface IProps {
    isOpenModal: boolean;
    setIsOpenModal: (v: boolean) => void;
}

const AddPlayList = (props: IProps) => {
    const {
        isOpenModal, setIsOpenModal
    } = props;
    const { accessToken, user } = useContext(AuthContext)!
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [urlUpload, setUrlUpload] = useState<string>("")
    const { setRefreshPlaylist, refreshPlaylist } = useGlobalContext()!

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsOpenModal(false);
    }

    const onFinish = async (values: any) => {
        if (!values.description) values.description = ""
        const res = await handleAddPlaylistAction(user._id, values.name, values.description, urlUpload)
        if (res?.statusCode === 201) {
            setRefreshPlaylist(!refreshPlaylist)
            notification.success({ message: res?.message })
            form.resetFields()
            setIsOpenModal(false);
            setUrlUpload("")
            return;
        }
        notification.warning({ message: res?.message })
    };

    const propsUpload: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
        method: 'POST',
        name: "file",
        listType: "picture-card",
        className: "avatar-uploader",
        maxCount: 1,
        accept: ".jpg,.jpeg,.png",
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        data: {
            folder: "playlist-thumbnail"
        },
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setUrlUpload(info.file.response.data)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };

    return (
        <Modal
            style={{ top: 50 }}
            title="New Playlist"
            open={isOpenModal}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
            footer={[
                <Button key="cancel" onClick={handleCloseCreateModal} >
                    Cancel
                </Button>,
                <Button key="ok" type="primary" onClick={() => form.submit()} style={{ background: '#1890ff', color: '#fff' }}>
                    OK
                </Button>,
            ]}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
                className='flex justify-center items-center gap-5'
            >
                <div className=''>

                    {urlUpload && urlUpload.length > 0 ?
                        <img src={urlUpload} alt="avatar" className='rounded-md shadow-md' style={{ width: "200px", height: "200px" }} />
                        :
                        <Upload
                            {...propsUpload}
                        >
                            <button style={{ border: 0, background: 'none', width: "200px", height: "200px" }} type="button">
                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8, }}>Upload</div>
                            </button>
                        </Upload>

                    }
                </div>
                <div>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name playlist!' },
                        ]}
                    >
                        <Input type='text' />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </div>

            </Form>
        </Modal>
    )
}

export default AddPlayList;