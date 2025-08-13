import {
    Modal, Input, Form,
    notification,
    Button,
    Space,
    Upload,
    UploadProps,
    Select,
    message,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '@/context/AuthContext';
import { handleCreateMusicAction } from '@/actions/music.action';
import { handleGetAllUser } from '@/actions/manage.user.action';
import { lyricMusicAction, separateMusicAction } from '@/actions/ai.action';
import { useGlobalContext } from '@/library/global.context';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    listCate: { _id: string, categoryName: string }[] | []
}

const AddMusicModal = (props: IProps) => {
    const {
        isCreateModalOpen, setIsCreateModalOpen, listCate
    } = props;
    const { progressUploadMusic, setInformationUpload, setProgressUploadMusic } = useGlobalContext()!
    const [form] = Form.useForm();
    const [urlUploadMp3, setUrlUploadMp3] = useState<string>("")
    const [mp3File, setMp3File] = useState<File | null>(null)
    const [loading, setLoading] = useState(false);
    const [listCateChoose, setListCateChoose] = useState<{ _id: string, categoryName: string }[] | []>([])
    const { accessToken, user } = useContext(AuthContext)!
    const [urlUploadImage, setUrlUploadImage] = useState<string>("")
    const [dataSearch, setDataSearch] = useState<{ value: string, label: JSX.Element, text: string }[]>([]);
    const [separate, setSeparate] = useState<string[]>([])
    const [lyrics, setLyrics] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [dataCreate, setDataCreate] = useState<any>(null)
    const [isKaraoke, setIsKaraoke] = useState(false);





    const handleCloseCreateModal = () => {
        form.resetFields()
        setLoading(false)
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        if (listCateChoose.length <= 0) {
            notification.warning({ message: "Please choose category of music!" })
        }
        setInformationUpload({ image: urlUploadImage, name: values.musicDescription })

        const newListCate = listCateChoose.map(category => category._id);
        const selectedValues = values.musicTag;

        const data = {
            musicUrl: urlUploadMp3,
            userId: user._id,
            musicDescription: values.musicDescription,
            musicThumbnail: urlUploadImage,
            musicTag: selectedValues,
            categoryId: newListCate,
            isKaraoke: isKaraoke
        }
        setDataCreate(data)
        setIsLoading(true);
        form.resetFields()
        setIsCreateModalOpen(false);

        if (!isKaraoke) {
            // Nếu không chọn Karaoke, chỉ upload nhạc, không gọi AI
            setProgressUploadMusic(100);
            return;
        }
        try {
            setProgressUploadMusic(15);

            console.log("Đang tách nhạc.....");
            const dataSeparate = await separateMusicAction(mp3File!)
            setSeparate(dataSeparate.files)
            console.log("dataSeparate>>>>", dataSeparate);
            setProgressUploadMusic(46);

        } catch (error) {
            console.error("Error:", error);
            setSeparate([])
        } finally {
            try {
                console.log("Đang lấy lyric.....");

                const dataLyric = await lyricMusicAction(mp3File!)
                setLyrics(dataLyric)
                console.log("dataLyric>>>>", dataLyric);
                setProgressUploadMusic(77);
            } catch (error) {
                console.error("Error:", error);
                setLyrics([])
            } finally {
                setProgressUploadMusic(100);
            }

        }
    };

    useEffect(() => {
        if (isLoading && progressUploadMusic === 100 && dataCreate) {
            (async () => {
                const newSeparate = separate.filter(x => !x.endsWith("vocals.wav"))
                const configData = { ...dataCreate, musicSeparate: newSeparate, musicLyric: lyrics }
                const res = await handleCreateMusicAction(configData)
                if (res?.statusCode === 201) {
                    notification.success({ message: "Created successfully" })
                    setUrlUploadImage("")
                    setListCateChoose([])
                    setIsLoading(false)
                    setLyrics([])
                    setDataCreate(null)
                    setSeparate([])
                    setDataSearch([])
                    setUrlUploadMp3("")
                    setTimeout(() => setProgressUploadMusic(0), 1000);
                    setInformationUpload(null)
                    return
                }
                notification.error({ message: res?.message })
            })()
        }
    }, [isLoading, progressUploadMusic])



    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const propsUpload: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-music`,
        method: 'POST',
        name: "file",
        maxCount: 1,
        accept: "audio/mp3",
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        onChange: async (info) => {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                const uploadedUrl = info.file.response.data;
                setUrlUploadMp3(uploadedUrl)

                const file = info.file.originFileObj as File;

                setMp3File(file)


                // message.success(`${info.file.name} file uploaded successfully`);
                // notification.success({ message: `${info.file.name} file uploaded successfully.` })

            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };

    const propsUploadImage: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
        method: 'POST',
        name: "file",
        className: "avatar-uploader",
        maxCount: 1,
        accept: ".jpg,.jpeg,.png",
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        data: {
            folder: "thumbnails"
        },
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setUrlUploadImage(info.file.response.data)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };

    useEffect(() => {
        form.setFieldValue("category", listCate)

    }, [isCreateModalOpen, listCate])

    const handleAddCateChoose = (itemP: any) => {
        if (!checkChoose(itemP._id)) {
            return setListCateChoose(prev => [...prev, itemP])
        } else if (checkChoose(itemP._id)) {
            const newList = listCateChoose.filter(x => x._id !== itemP._id)
            return setListCateChoose(newList)
        } else {
            return setListCateChoose([itemP])
        }
    }

    const checkChoose = (id: string): boolean => {
        return listCateChoose?.some(item => item._id === id) ?? false;
    };

    return (
        <div>

            <Modal
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseCreateModal()}
                maskClosable={false}
                loading={loading}
                footer={[
                    <Button key="cancel" onClick={handleCloseCreateModal} >
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" onClick={() => form.submit()} style={{ background: '#1890ff', color: '#fff' }}>
                        OK
                    </Button>,
                ]}
                title={<div style={{ color: "white", fontWeight: 600, backgroundColor: "#111827" }}>Upload New Music</div>}
                style={{
                    backgroundColor: "#111827", // modal border
                    borderRadius: 12,
                    borderColor: "#111827",
                    top: 50
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
                <Form
                    name="basic"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <div className='flex justify-between'>
                        <Form.Item
                            name="musicMP3"
                            label="Music"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Must be .mp3"
                            rules={[
                                {
                                    validator: (_, fileList) => {
                                        if (fileList && fileList.length > 0) {
                                            const isMp3 = fileList[0].type === 'audio/mpeg'; // Correct MIME type for MP3
                                            if (!isMp3) {
                                                return Promise.reject(new Error('You can only upload MP3 files!'));
                                            }
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Please upload an MP3 file!'));
                                    }
                                }
                            ]}
                        >
                            <Upload
                                {...propsUpload}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>

                        </Form.Item>
                        <Form.Item
                            name="musicThumbnail"
                            label="Thumbnail"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Must be .jpg, .png, .jpeg"
                            rules={[
                                {
                                    validator: (_, fileList) => {
                                        if (fileList && fileList.length > 0) {
                                            const isImage = fileList[0].type === 'image/png' || fileList[0].type === 'image/jpeg';
                                            if (!isImage) {
                                                return Promise.reject(new Error('You can only upload PNG or JPG images!'));
                                            }
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Please upload an image!'));
                                    }
                                }
                            ]}
                        >
                            <Upload
                                {...propsUploadImage}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>

                        </Form.Item>
                    </div>
                    <div className='mb-2 flex gap-1 text-white'><span className='text-red-500 text-1xl'>*</span>Category</div>
                    <div className='flex gap-2 flex-wrap mb-2'>
                        {listCate && listCate.length > 0 && listCate.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleAddCateChoose(item)}
                                className={`border ${checkChoose(item._id) ? "border-green-500" : "border-gray-300"} p-2 rounded-md cursor-pointer text-white`}>{item.categoryName}</div>
                        ))}
                    </div>
                    <div className='mb-2 flex gap-1 text-white'><span className='text-red-500 text-1xl'>*</span>Tag</div>
                    <Form.List name="musicTag" initialValue={[""]}>
                        {(fields, { add, remove }) => (
                            <div className='mt-3 flex gap-3'>
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add tag</Button>
                                </Form.Item>
                                <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {fields.map((field) => (
                                        <Form.Item
                                            key={field.key}
                                        >
                                            <Space
                                                style={{ position: "relative" }}>
                                                {/* <Form.Item
                                                    hasFeedback
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[{ required: true, message: 'Please input your music tag!' }]}
                                                    noStyle
                                                > */}
                                                {/* <Input style={{ width: 100 }} placeholder="Enter tag" type='text' /> */}
                                                {/* </Form.Item> */}
                                                <Form.Item
                                                    style={{ minWidth: "150px" }}
                                                    hasFeedback
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[{ required: true, message: 'Please enter your music tag!' }]}
                                                >
                                                    <Input
                                                        style={{ minWidth: "50px" }}
                                                        placeholder="Enter tag"
                                                    />
                                                </Form.Item>

                                                {fields.length > 1 && <MinusCircleOutlined
                                                    style={{
                                                        position: "absolute",
                                                        top: -5,
                                                        right: 0,
                                                        color: "#2d3436"
                                                    }}
                                                    onClick={() => remove(field.name)} />}
                                            </Space>
                                        </Form.Item>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </Form.List>
                    <Form.Item
                        label="Title"
                        name="musicDescription"
                        rules={[{ required: true, message: 'Please input your product title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Karaoke Checkbox sau cùng */}
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="karaoke"
                            checked={isKaraoke}
                            onChange={e => setIsKaraoke(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="karaoke" className="text-white select-none cursor-pointer">Generate Karaoke (AI)</label>
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
     .ant-form-item-label > label {
    color: white !important;
  }

  .ant-input,
  .ant-input-affix-wrapper,
  .ant-input-textarea,
  .ant-select-selector {
    background-color: #1f2937 !important; /* Darker background */
    color: white !important;
    border-color: #374151 !important; /* Border dark-gray */
  }

  .ant-input::placeholder {
    color: #9ca3af !important; /* Tailwind gray-400 */
  }

  .ant-upload {
    background-color: transparent !important;
    color: white !important;
  }

  .ant-form-item-explain-error {
    color: #f87171 !important; /* Tailwind red-400 */
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
    /* Label for Form.Item */
  .ant-form-item-label > label {
    color: white !important;
  }

  /* Input, Textarea, Select */
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-input-textarea,
  .ant-select-selector {
    background-color: #1f2937 !important;
    color: white !important;
    border-color: #374151 !important;
  }

  /* Placeholder text */
  .ant-input::placeholder,
  .ant-select-selection-placeholder {
    color: #9ca3af !important; /* gray-400 */
  }

  /* Upload area */
  .ant-upload {
    color: white !important;
  }

  /* Extra text like "Must be .jpg" */
  .ant-form-item-extra {
    color: white !important;
  }
.ant-form-item-extra:hover {
  color: #d1d5db !important; /* Tailwind: gray-300 */
}
  .ant-upload-list-item-name {
    color: white !important;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
  }
    .ant-upload-list-item .anticon-paper-clip svg {
  fill: white !important;
  color: white !important;
}
  /* Error messages */
  .ant-form-item-explain-error {
    color: #f87171 !important; /* red-400 */
  }

  /* Button styles */
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

  /* Dashes (dashed button like "Add Tag") */
  .ant-btn-dashed {
    border-color: #6b7280 !important;
    color: white !important;
  }

  /* Tag in Category List */
  .ant-tag {
    background-color: #374151 !important;
    color: white !important;
    border-color: transparent !important;
  }
`}</style>
        </div >
    )
}

export default AddMusicModal;