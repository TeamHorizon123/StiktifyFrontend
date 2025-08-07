"use client";
import React, { useState, useContext, useEffect } from "react";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { sendRequest, sendRequestFile } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

interface ICreateResponse {
  statusCode: number;
  message: string;
  data?: string | null;
}

interface EditProductProps {
  product: Product | null;
  onClose: () => void;
  refreshProducts: () => void;
}

const EditProduct = ({
  product,
  onClose,
  refreshProducts,
}: EditProductProps) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [options, setOption] = useState<object[]>([]);
  const [categoryChoose, setCategoryChoose] = useState<string | null>(product.CategoryId);

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

  const onChange = (value: string) => {
    setCategoryChoose(value);
  }

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

  useEffect(() => {
    if (!accessToken) return;
    const getCategories = async () => {
      const res = await sendRequest<IListOdata<ICategory>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/category`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: {
          $filter: ("ParentId eq null")
        }
      });
      // console.log(res.value);

      if (res.value) setCategories(res.value);
    };
    getCategories();
  }, [accessToken])

  useEffect(() => {
    form.setFieldsValue({
      Name: product?.Name,
      Description: product?.Description,
    })
  }, [])

  useEffect(() => {
    setOption(categories.map((categorySize) => (
      {
        value: categorySize.Id,
        label: categorySize.Name
      }
    )));
  }, [categories])

  const handleUpdate = async () => {
    try {
      const formData = form.getFieldsValue();
      let img;
      if (thumbnail)
        img = await UploadFile(thumbnail);
      const payload = {
        Id: product?.Id,
        Name: formData.Name,
        Description: formData.Description,
        CategoryId: categoryChoose,
        ImageUri: img ?? product?.ImageUri,
        ShopId: product?.ShopId
      }

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product/${product?.Id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload
      })
      onClose();
      refreshProducts();
    } catch (error) {
      console.error('error fetch data', error);
    }
  }


  return (
    <Form layout="horizontal"
      form={form}
      labelCol={{ span: 6 }}
      clearOnDestroy={true}>
      <Form.Item label="Name" name={"Name"} required>
        <Input maxLength={100} showCount />
      </Form.Item>
      <Form.Item label="Description" name={"Description"} required>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Image">
        <Upload
          listType="picture"
          beforeUpload={beforeUpload}
          onChange={(e) => handleFileChange(e, setThumbnail)}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload image(Max: 1)</Button>
        </Upload>
      </Form.Item>
      <Form.Item label="Category" name={"CategoryId"} required>
        <Select
          allowClear
          showSearch
          defaultValue={product?.CategoryId}
          placeholder="Select category of product"
          optionFilterProp="label"
          onChange={onChange}
          // onSearch={onSearch}
          options={options}
        />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black rounded-lg px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            // loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            Save
          </button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditProduct;
