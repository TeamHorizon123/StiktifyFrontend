"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatCurrencyVND } from '@/utils/utils'
import React, { useContext, useEffect, useState } from 'react'

const ProductItem = (data: ICart) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [option, setOption] = useState<IProductOption | null>(null);
    const [variant, setVariant] = useState<ProductVariant | null>(null);

    useEffect(() => {
        const getOption = async () => {
            try {
                const res = await sendRequest<IListOdata<IProductOption>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-option/`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${data.OptionId}'`
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
            } catch {
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
                        $filter: `Id eq '${data.VariantId}'`,
                        $expand: 'Size'
                    }
                });
                if (res.value) setVariant(res.value[0]);
            } catch {
            }
        }

        getOption();
        getVariant();
    }, [accessToken, data]);

    return (
        <div className='flex items-end justify-between'>
            <div className='flex items-start space-x-4'>
                <img
                    className='w-24 h-24 bg-white rounded'
                    src={data.ImageUri} alt="Cart image" />
                <div className='h-24 flex flex-col justify-between'>
                    <div>
                        <p className='uppercase'>{data.Product.Name}</p>
                        <p className='text-sm font-extralight'>Type: {[option?.Color, option?.Type].filter(Boolean).join(", ")}, {variant?.Size?.Size}</p>
                    </div>

                    <span className=' font-bold text-[#EF4444] text-lg'>{formatCurrencyVND(variant?.Price ?? option?.Price ?? 0)}</span>
                </div>
            </div>
            <div className='h-fit flex space-x-1'>
                <span>Quantity:</span>
                <input
                    className='text-center w-16 outline-none pointer-events-none bg-transparent'
                    type="text"
                    value={data.Quantity}
                    // value={1}
                    readOnly />
            </div>
        </div>
    )
}

export default ProductItem