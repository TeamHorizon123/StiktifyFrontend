"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatCurrencyVND } from '@/utils/utils';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

const OrderItem = (data: IOrderItem) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [option, setOption] = useState<IProductOption | null>(null);
    const [variant, setVariant] = useState<ProductVariant | null>(null);

    useEffect(() => {
        const getOption = async () => {
            try {
                const res = await sendRequest<IListOdata<IProductOption>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-option`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${data.ProductVariant.ProductOptionId}'`
                    }
                });
                if (res.value) {
                    const mappedOptions = res.value.map((option) => ({
                        ...option,
                        Color: option.Color === "None" ? "" : option.Color,
                        Type: option.Type === "None" ? "" : option.Type,
                    }));

                    setOption(mappedOptions[0]);
                }
            } catch (error) {
                console.log('Error fetch option data', error);
            }
        }

        const getVariant = async () => {
            try {
                const res = await sendRequest<IListOdata<ProductVariant>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-variant/`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${data.ProductVariantId}'`,
                        $expand: 'Size'
                    }
                });
                if (res.value) setVariant(res.value[0]);
            } catch (error) {
                console.log('Error fetch variant data: ', error);
            }
        }

        getOption();
        getVariant();
    }, []);

    return (
        <div className='py-2 flex items-end' key={data.Id}>
                <img className='w-24 h-24 bg-white rounded' src={data.ImageURI} alt="item image" />
                <div className='px-2'>
                    <Link href={`/page/shop/product/${data.ProductId}`} className='text-lg text-white hover:text-white hover:underline'>{data.Product.Name}</Link>
                    <p>Option: {[option?.Color, option?.Type].filter(Boolean).join(" - ")}, Variant: {variant?.Size?.Size}</p>
                    <p>Quantity: {data.Quantity}</p>
                    <p>Unit price: {formatCurrencyVND(data.UnitPrice)}</p>
                    <p className='text-lg font-bold'>Total: {formatCurrencyVND(data.UnitPrice * data.Quantity)}</p>
                </div>
        </div>
    )
}

export default OrderItem