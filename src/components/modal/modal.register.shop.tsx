"use client";

import { AuthContext } from '@/context/AuthContext'
import { sendRequest, sendRequestFile } from '@/utils/api';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Result, Select, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import React, { useContext, useEffect, useState } from 'react'

const { Option } = Select;

interface Ward {
  ward_code: string;
  ward_name: string;
}

interface Province {
  code: string;
  name: string;
  wards: Ward[];
}

interface ICreateResponse {
  statusCode: number;
  message: string;
  data?: string | null;
}

interface FunctionReCall {
  onClose: () => void,
  onReload: () => void
}

const ModalRegisterShop = ({ onClose, onReload }: FunctionReCall) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedWards, setSelectedWards] = useState<Ward[]>([]);
  const [createStatus, setCreateStatus] = useState(0);

  useEffect(() => {
    fetch('/VN_Location.json')
      .then(res => res.json())
      .then((data: Province[]) => {
        const dataSort = (data || []).sort((a, b) =>
          a.name.localeCompare(b.name, 'vi'));
        setProvinces(dataSort);
      });
  }, []);

  const handleProvinceChange = (provinceCode: string) => {
    const selectedProvince = provinces.find(p => p.name === provinceCode);
    const sortedWards = (selectedProvince?.wards || []).sort((a, b) =>
      a.ward_name.localeCompare(b.ward_name, 'vi')
    );
    setSelectedWards(sortedWards);
    form.setFieldsValue({ Ward: undefined });
  };

  const handleFileChange = (
    e: UploadChangeParam<UploadFile>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.file.originFileObj;
    if (file) setFile(file);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      message.error("Only up load image!");
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isImage && isLt2M;
  };

  // start Upload file
  const UploadFile = async (file: File) => {
    try {
      let imageUrl = "";
      if (file) {
        const uploadImageForm = new FormData();
        uploadImageForm.append("file", file);
        uploadImageForm.append("folder", "thumbnails");
        const thumbnailUploadRes = await sendRequestFile<ICreateResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadImageForm,
        });
        if (thumbnailUploadRes.statusCode === 201) {
          imageUrl = thumbnailUploadRes.data ?? "";
        }
      }
      return imageUrl;
    } catch {
      message.error("Upload image fail!")
    }
  }
  // End upload file

  const OnFinishForm = async () => {
    setLoading(true);
    try {
      const formData = form.getFieldsValue();
      const ImageUri = avatar ? await UploadFile(avatar) : `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URI}=${formData?.ShopName}`;
      const payload = {
        UserId: user?._id,
        ShopName: formData?.ShopName,
        Description: formData?.Description,
        AvatarUri: ImageUri,
        Email: user?.email,
        Phone: formData?.Phone,
        Address: `${formData?.Address}, ${formData?.Ward}, ${formData?.Province}`,
        Status: "inactive"
      }
      // console.log("Payload:", payload);

      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload
      })
      if (res.id) {
        message.success("Register shop success!");
        onClose();
        onReload();
      }
    } catch {
      // Not
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className='flex flex-col items-center w-full '>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <span>Registering store...</span>
      </div>
    )

  if (createStatus == 201)
    return (
      <>
        <Result
          status={'success'}
          title='Successfully register your store.'
        />
      </>
    )

  return (
    <>
      <Form
        layout='horizontal'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        style={{ maxWidth: 800, display: 'flex', flexDirection: 'column' }}
        initialValues={{ Email: user?.email }}
        clearOnDestroy={true}
        onFinish={() => OnFinishForm()}
      >
        <div>
          <Form.Item label='Store Name' name={"ShopName"} rules={[{ required: true }]}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item label='Store Description' name={"Description"} rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Avatar">
            <Upload
              listType="picture"
              beforeUpload={beforeUpload}
              onChange={(e) => handleFileChange(e, setAvatar)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload image(Max: 1)</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Email" name={"Email"} >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            name="Phone"
            label="Phone Number"
            rules={[
              { required: true },
              { pattern: /^[0-9]{9,15}$/, message: 'Invalid phone number.' }
            ]}
          >
            <Input maxLength={15} />
          </Form.Item>
          <Form.Item name="Province" label="Province/City" rules={[{ required: true }]}>
            <Select allowClear showSearch onChange={handleProvinceChange} placeholder="Choose province/city">
              {provinces.map((province) => (
                <Option key={province.code} value={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Chọn Phường/Xã */}
          <Form.Item name="Ward" label="Ward/commune" rules={[{ required: true }]}>
            <Select allowClear showSearch placeholder="Choose Ward/commune" disabled={!selectedWards.length}>
              {selectedWards.map((ward) => (
                <Option key={ward.ward_code} value={ward.ward_name}>
                  {ward.ward_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Address' name={'Address'} required>
            <Input />
          </Form.Item>
        </div>

        <Button className='items-end' type="default" htmlType='submit'>
          Register
        </Button>
      </Form>
    </>
  )
}

export default ModalRegisterShop