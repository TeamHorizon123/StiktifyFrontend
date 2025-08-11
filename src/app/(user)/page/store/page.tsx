"use client";

import ModalEditShop from '@/components/modal/modal.edit.shop.infor';
import ModalRegisterShop from '@/components/modal/modal.register.shop';
import { AuthContext } from '@/context/AuthContext'
import { sendRequest, sendRequestFile } from '@/utils/api';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Descriptions, DescriptionsProps, Empty, message, Modal, Spin, Typography, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
interface ICreateResponse {
  statusCode: number;
  message: string;
  data?: string | null;
}

interface IUserDetail {
  _id: string;
  image: string;
  fullname: string;
  email: string;
  isActive: boolean;
  bio: string;
  address: string;
  createdAt: string;
  totalFollowers: number;
  totalFollowings: number;
  totalViews: number;
  totalLikes: number;
  isShop: boolean;
}

const StorePage = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showChooseImg, setShowChooseImg] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [userData, setUserData] = useState<IUserDetail | null>(null);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Shop name',
      children: shop?.ShopName
    },
    {
      key: '2',
      label: 'Telephone',
      children: shop?.Phone,
    },
    {
      key: '3',
      label: 'Rating',
      children: shop?.AveragePoint,
    },
    {
      key: '4',
      label: 'Description',
      children: shop?.Description,
    },
    {
      key: '5',
      label: 'Address',
      children: shop?.Address,
    },
  ];

  const getShop = async () => {
    try {
      const res = await sendRequest<IListOdata<Shop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: {
          $filter: `UserId eq '${user?._id}'`
        }
      });

      if (res.value) setShop(res.value[0]);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const fetchUserDetail = async () => {
    if (!accessToken) return
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${user?._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data) {
        setUserData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    getShop();
    fetchUserDetail();
    setLoading(false);

  }, [accessToken, user]);

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

  const handleFileChange = (
    e: UploadChangeParam<UploadFile>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.file.originFileObj;
    if (file) setFile(file);
  };

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

  const handleUpdateImg = async () => {
    const ImageUri = thumbnail ? await UploadFile(thumbnail) : null;
    const payload = {
      Id: shop?.Id,
      UserId: shop?.UserId,
      ShopName: shop?.ShopName,
      Description: shop?.Description,
      AvatarUri: ImageUri,
      Email: shop?.Email,
      Phone: shop?.Phone,
      Address: shop?.Address,
      Status: "active"
    }
    const res = await sendRequest<IOdataRes<Shop>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop/${shop?.Id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: payload
    })

    if (res.value) message.success("Update avatar success!");
    await getShop();
    setShowChooseImg(false);
  }

  if (loading)
    return (
      <div className='h-[100vh] bg-white flex flex-col items-center justify-center'>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <span>Checking your store...</span>
      </div>
    )

  if (!shop)
    return (
      <div className='p-4 min-h-screen w-[90vw] text-center items-center flex justify-center flex-col'>
        <Empty
          description={
            <Typography.Text>
              You have not registered your store.
            </Typography.Text>
          }
        >
          <Button type="default" onClick={() => {
            if (userData && userData?.totalFollowers >= 1000)
              setShowModal(true)
            else message.info("Your account is not eligible to register for store ownership.");
          }}>Register Now</Button>
        </Empty>
        <Modal
          title={"Register your Stiktify store"}
          footer={null}
          onCancel={() => setShowModal(false)}
          destroyOnClose={true}
          open={showModal}>
          <ModalRegisterShop onClose={() => setShowModal(false)} onReload={() => getShop()} />
        </Modal>
      </div>
    )

  return (
    <div className=' p-4 min-h-[100vh] w-[80vw]'>
      <div className='flex items-center space-x-2 border-b p-2'>
        <div className='flex flex-col items-center space-y-4'>
          <img className='w-[200px] h-[200xp] bg-white' src={shop.AvatarUri ?? ""} alt="Shop avatar" />
          <button onClick={() => setShowChooseImg(true)} className='p-1 border rounded hover:bg-slate-200'>Change other image</button>
        </div>
        <Descriptions className='w-[80vw]' title="Store information" items={items} />
      </div>
      <div className='py-5 flex space-x-5'>
        <Link className='py-1 px-2 border border-gray-700 rounded hover:bg-slate-200' href={`store/manage-product`} >Manage product</Link>
        <Link className='py-1 px-2 border border-gray-700 rounded hover:bg-slate-200' href={`store/manage-order`} >Manage Order</Link>
        <button
          onClick={() => setShowModal(true)}
          className='py-1 px-2 border border-gray-700 rounded hover:bg-slate-200'>Edit store information</button>
      </div>

      <Modal
        title={"Edit store information"}
        centered
        footer={null}
        onCancel={() => setShowChooseImg(false)}
        destroyOnClose={true}
        visible={showChooseImg}>
        <Upload
          listType="picture"
          beforeUpload={beforeUpload}
          onChange={(e) => handleFileChange(e, setThumbnail)}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload image(Max: 1)</Button>
        </Upload>
        <div className='mt-2 flex space-x-2 items-end justify-end'>
          <button
            onClick={() => setShowChooseImg(false)}
            className='p-1.5 px-4 border border-black rounded-md hover:bg-slate-200'>Cancel</button>
          <button
            onClick={() => handleUpdateImg()}
            className='bg-black p-1.5 px-4 text-white rounded-md border hover:border-black hover:bg-white hover:text-black hover:shadow-md'>OK</button>
        </div>
      </Modal>


      <Modal
        title={"Edit store information"}
        footer={null}
        onCancel={() => setShowModal(false)}
        destroyOnClose={true}
        visible={showModal}>
        <ModalEditShop
          shopData={shop}
          showModal={() => setShowModal(false)}
          loadData={async () => await getShop()} />
      </Modal>
    </div>

  )
}

export default StorePage