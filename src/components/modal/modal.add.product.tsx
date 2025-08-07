"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest, sendRequestFile } from '@/utils/api';
import { CloseOutlined, LoadingOutlined, ShopFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space, Upload, Card, InputNumber, message, Typography, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import React, { useContext, useEffect, useState } from 'react'

const ModalAddProduct = ({ id }: Id) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState<object[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryChoose, setCategoryChoose] = useState<string | null>(null);
  const [cateSize, setCateSize] = useState<CategorySize[]>([]);
  const [cateSizes, setCateSizes] = useState<object[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [optionImage, setOptionImage] = useState<File[]>([]);
  const [name, setName] = useState<string | "">("");
  const [desc, setDesc] = useState<string | "">("");
  // const [option, setOption] = useState<object[]>([{}]);
  const [productId, setProductId] = useState<string | "">("");
  const [form] = Form.useForm();

  interface ICreateResponse {
    statusCode: number;
    message: string;
    data?: string | null;
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

  const onChange = (value: string) => {
    setCategoryChoose(value);
  }

  useEffect(() => {
    if (!accessToken) return;
    let query;
    if (!categoryChoose) {
      query = {
        $filter: "CategoryId eq null"
      }
    } else {
      query = {
        $filter: `CategoryId eq '${categoryChoose}'`
      }
    }

    const getCategorySize = async () => {
      const res = await sendRequest<IListOdata<CategorySize>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-size`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: query
      });
      if (res.value) setCateSize(res.value);
    }
    getCategorySize();

  }, [accessToken, categoryChoose]);

  useEffect(() => {
    setCategoryOption(categories.map((category) => (
      {
        value: category.Id,
        label: category.Name,
      }
    )));
    setCateSizes(cateSize.map((categorySize) => (
      {
        value: categorySize.Id,
        label: categorySize.Size
      }
    )));
  }, [categories, cateSize])

  // start set file
  const handleFileChange = (
    e: UploadChangeParam<UploadFile>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.file.originFileObj;
    if (file) setFile(file);
  };

  const handleOptionFileChange = (e, index) => {
    const file = e.file.originFileObj;
    if (!file) return;
    const files = [...optionImage];
    files[index] = file;
    setOptionImage(files);

  }
  // End set file

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

  // start post data
  const handleSubmitCreate = async () => {
    try {
      setLoading(true);

      const formData = form.getFieldsValue();

      const thumbnailUri = thumbnail ? await UploadFile(thumbnail) : null;

      const options = await Promise.all(
        (formData.Options || []).map(async (opt, index) => {
          const optionImageFile = optionImage[index]; // lấy file đã lưu trước đó
          const imageUrl = optionImageFile ? await UploadFile(optionImageFile) : null;

          return {
            ...opt,
            Image: imageUrl,
            ProductVariants: opt.ProductVariants?.map(variant => ({
              ...variant,
              Quantity: Number(variant.Quantity),
              Price: Number(variant.Price),
            })) || []
          };
        })
      );

      const payload = {
        Name: formData.Name,
        ShopId: id,
        Description: formData.Description,
        ImageUri: thumbnailUri,
        CategoryId: formData.CategoryId,
        Options: options
      };

      // console.log("Payload:", payload);

      const res = await sendRequest<ICreateResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload
      })
      if (res) return message.info("Successfully create product.");
    } catch (err) {
      throw new Error(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }
  // End post data

  if (loading)
    return (
      <div className='flex flex-col items-center w-full '>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <span>Creating product...</span>
      </div>
    )

  return (
    <Form layout="horizontal"
      form={form}
      labelCol={{ span: 4 }}
      clearOnDestroy={true}>
      <Form.Item label="Name" name={"Name"}>
        <Input onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item label="Description" name={"Description"}>
        <TextArea rows={4} onChange={(e) => setDesc(e.target.value)} />
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
      <Form.Item label="Category" name={"CategoryId"}>
        <Select
          allowClear
          showSearch
          placeholder="Select category of product"
          optionFilterProp="label"
          onChange={onChange}
          // onSearch={onSearch}
          options={categoryOption}
        />
      </Form.Item>
      <Form.List name="Options">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Option ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Form.Item label="Color" name={[field.name, 'Color']}>
                  <Input />
                </Form.Item>
                <Form.Item label="Type" name={[field.name, 'Type']}>
                  <Input />
                </Form.Item>
                <Form.Item label="Image" name={[field.name, 'Image']}>
                  <Upload
                    listType="picture"
                    key={field.key}
                    beforeUpload={beforeUpload}
                    onChange={(e) => handleOptionFileChange(e, field.name)}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload image(Max: 1)</Button>
                  </Upload>
                </Form.Item>
                {/* Nest Form.List */}
                <Form.Item label="Variant">
                  <Form.List name={[field.name, 'ProductVariants']}>
                    {(subFields, subOpt) => (
                      <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                        {subFields.map((subField) => (
                          <Card
                            key={subField.key}
                            extra={
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />}>
                            <Form.Item style={{ width: "100%" }} name={[subField.name, 'SizeId']}>
                              <Select
                                allowClear
                                showSearch
                                key={subField.key}
                                placeholder="Select category size"
                                // onChange={handleChange}
                                options={cateSizes}
                              />
                            </Form.Item>
                            <Form.Item className='mb-0 flex space-x-3'>
                              <Form.Item noStyle name={[subField.name, 'Quantity']}>
                                <InputNumber placeholder="Quantity" />
                              </Form.Item>
                              <Form.Item noStyle name={[subField.name, 'Price']}>
                                <InputNumber placeholder="Price" />
                              </Form.Item>
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          + Add Sub Item
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Add option
            </Button>
          </div>
        )}
      </Form.List>
      {/* <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item> */}
      <Form.Item style={{ marginTop: "20px" }}>
        <Space>
          <button onClick={() => handleSubmitCreate()} className='bg-black p-1.5 px-4 text-white rounded-md border hover:border-black hover:bg-white hover:text-black hover:shadow-md'>Submit</button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ModalAddProduct