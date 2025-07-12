"use client";

import { AuthContext } from '@/context/AuthContext'
import useFetchItem from '@/modules/shop/useFetchItem'
import Link from 'next/link'
import React, { useContext } from 'react'


const StorePage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const { data: shop } = useFetchItem<Shop>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/shop/owner/${user?._id}`,
    method: "GET"
  })

  if (shop)
    return (
      <div className='p-2 min-h-[100vh] bg-white'>
        <p>You do not have store. Let create your shop.</p>
      </div>
    )

  return (
    <div className='p-2 min-h-[100vh] bg-white'>
      <p>{JSON.stringify(user?._id)}</p>
      <Link href={`store/manage-product`} >Manage product</Link>
    </div>
  )
}

export default StorePage