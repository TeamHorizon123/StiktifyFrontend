"use client";

import { AuthContext } from '@/context/AuthContext'
import { sendRequest } from '@/utils/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'


const StorePage = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    setLoading(true);
    const getShop = async () => {
      try {
        const res = await sendRequest<IListOdata<Shop>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/shop`,
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

    getShop();
  }, [accessToken, user]);

  if (loading)
    return (
      <div className='h-[100vh] bg-white flex flex-col items-center justify-center'>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <span>Checking your store...</span>
      </div>
    )

  if (!shop)
    return (
      <div className='p-2 min-h-[100vh] bg-white'>
        <p>You do not have store. Let create your shop.</p>
      </div>
    )

  return (
    <div className='p-2 min-h-[100vh] bg-white'>
      <p>{!shop}</p>
      <Link href={`store/manage-product`} >Manage product</Link>
    </div>
  )
}

export default StorePage