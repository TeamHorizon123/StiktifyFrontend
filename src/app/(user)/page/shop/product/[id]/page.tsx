"use client";

import ProductInfo from '@/app/(user)/page/shop/product/[id]/productInfo'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

const ProductDetailPage = () => {
    const { id } = useParams();

    return (
        <div className='w-3/4 h-fit m-auto flex flex-col space-y-4'>
            <div className='flex space-x-2 text-white text-sm'>
                <p><Link className='hover:underline hover:text-white text-gray-400' href="/page/shop">Stiktify shop</Link></p>
                <p>/</p>
                <p>Product name</p>
            </div>
            <ProductInfo id={id.toString()} />

        </div>
    )
}

export default ProductDetailPage