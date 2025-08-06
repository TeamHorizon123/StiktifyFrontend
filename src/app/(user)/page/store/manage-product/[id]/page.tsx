"use client";

import EditProduct from '@/components/modal/modal.edit.product';
import LoadingPage from '@/components/page/shop/loading/loadingPage';
import CollapseOptionProduct from '@/components/page/shop/product/manage-product/collapseProduct';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Descriptions, DescriptionsProps, message, Modal } from 'antd';
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";

const PageProductStoreInfo = () => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Product Name',
      children: product?.Name || "Unknown",
    },
    {
      key: '2',
      label: 'Category',
      children: product?.Category?.Name || "N/A",
    },
    {
      key: '3',
      label: 'Price range',
      children: product?.PriceRange || "N/A",
    },
    {
      key: '4',
      label: 'Order turn',
      children: product?.Order?.toString() || "N/A",
    },
    {
      key: '5',
      label: 'Active',
      children: JSON.stringify(!product?.IsHidden) || "Unknown",
    },
    {
      key: '6',
      label: 'Average rating point',
      children: JSON.stringify(product?.AveragePoint) || "N/A",
    },
  ];

  const getProduct = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await sendRequest<IListOdata<Product>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: {
          $filter: `Id eq '${id}'`,
          $expand: "Category"
        }
      });

      if (res.value) setProduct(res.value[0]);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProduct();
  }, [accessToken, id]);

  const handleUpdate = async (e: boolean) => {
    try {
      const payload = {
        ...product,
        IsHidden: e
      }
      const res = await sendRequest<IOdataRes<Product>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product/${product?.Id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload
      });

      if (res.value) {
        message.success("Update product success.");
        getProduct();
      }
    } catch (error) {
      message.error("Update product fail.");
      console.error("Error update", error);
    }
  }

  if (loading)
    return (
      <LoadingPage notifyLoading='Loading product...' />
    )

  return (
    <div className='p-4 min-h-[100vh] bg-white'>
      <Link className='p-2 flex items-center space-x-2 text-sm' href={'/page/store/manage-product'}>
        <FaArrowLeftLong />
        <span>Back to page manage product</span>
      </Link>
      <div className='space-y-4'>
        <div className='py-4 flex space-x-4 border-b-2'>
          <img
            src={product?.ImageUri || ""}
            alt={product?.Name || "Product image"}
            style={{ width: '300px' }} />
          <Descriptions
            title={"Product information"}
            size={"small"}
            extra={[
              <button key={"edit"}
                onClick={() => setShowModal(true)}
                type='button' className='flex items-center space-x-2 bg-[#1C1B33] text-white px-2 py-1 rounded-md hover:underline mr-16'>
                <TbEdit className='text-base' />
                <span>Edit</span>
              </button>,
              product?.IsHidden ?
                <button key={"active"}
                  onClick={() => handleUpdate(false)}
                  type='button' className='mt-2 flex items-center space-x-2 bg-green-800 text-white px-2 py-1 rounded-md hover:underline mr-16'>
                  <TbEdit className='text-base' />
                  <span>Active product</span>
                </button> :
                <button key={"inactive"}
                  onClick={() => handleUpdate(true)}
                  type='button' className='mt-2 flex items-center space-x-2 bg-red-600 text-white px-2 py-1 rounded-md hover:underline mr-16'>
                  <span>Disable product</span>
                </button>
            ]}
            items={items}
          />
        </div>
        <div className=''>
          <CollapseOptionProduct id={product?.Id || ''} />
        </div>
      </div>

      <Modal
        title="Update product information"
        centered
        open={showModal}
        footer={null}
        closable
        onCancel={() => setShowModal(false)}
        destroyOnClose={true}
      >
        <EditProduct product={product || null} onClose={() => setShowModal(false)} refreshProducts={() => getProduct()} />
      </Modal>
    </div>
  )
}

export default PageProductStoreInfo