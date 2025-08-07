"use client";

import ProductInfo from '@/app/(user)/page/shop/product/[id]/productInfo'
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { message, Spin } from 'antd';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Product from '@/components/page/shop/product/product';
import { LoadingOutlined } from '@ant-design/icons';

const ProductDetailPage = () => {
    const [loading, setLoading] = useState(true);
    const { accessToken } = useContext(AuthContext) ?? {};
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>();

    useEffect(() => {
        const getProduct = async () => {
            try {
                if (!accessToken) return;
                setLoading(true);
                const res = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${id}'`,
                        $expand: "Shop"
                    }
                });

                if (res.value) setProduct(res.value[0]);
            } catch {
                message.error("Undefine error.");
            } finally {
                setLoading(false);
            }
        }

        getProduct();
    }, [accessToken, id]);

    if (loading)
        return (
            <>
                <div className="w-full h-[80vh] text-white flex flex-col items-center justify-center space-y-4">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: 'white' }} spin />} />
                    <span className="font-bold uppercase">Loading products...</span>
                </div>
            </>
        )

    return (
        <div className='main-layout'>
            <div className='w-3/4 py-2 h-fit m-auto flex flex-col space-y-4 '>
                <div className='flex space-x-2 text-white text-sm'>
                    <p><Link className='hover:underline hover:text-white text-gray-400' href="/page/shop">Stiktify shop</Link></p>
                    <p>/</p>
                    <p>{product?.Name}</p>
                </div>
                {
                    product ? (<>
                        <ProductInfo data={product} />
                    </>) : (<></>)
                }


            </div>
        </div>

    )
}

export default ProductDetailPage