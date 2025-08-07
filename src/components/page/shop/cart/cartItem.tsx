"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatCurrencyVND } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaTrashCan, FaMinus, FaPlus } from "react-icons/fa6";

interface ICartWithCallback extends ICart {
    onDeleted?: () => void;
}

const CartItem = (data: ICartWithCallback) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [shop, setShop] = useState<Shop | null>(null);
    const [variant, setVariant] = useState<ProductVariant | null>(null);
    const [option, setOption] = useState<IProductOption | null>(null);
    const [quantity, setQuantity] = useState(data.Quantity);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [contentModal, setContentModal] = useState("");

    useEffect(() => {
        const getShop = async () => {
            try {
                const res = await sendRequest<IListOdata<Shop>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop/`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${data.Product?.ShopId}'`
                    }
                });
                if (res.value) setShop(res.value[0]);
            } catch {
            }
        }

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

        getShop();
        getOption();
        getVariant();
    }, [accessToken, data]);

    const handleUpdateQuantity = async (value: number) => {
        try {
            const newQuantity = quantity + value;
            if (newQuantity == 0) {
                showConfirm('Are your sure delete this item?');
                return;
            }
            setQuantity(newQuantity);
            const updatedData = {
                ...data,
                Quantity: newQuantity
            };

            await sendRequest<IOdataRes<ICart>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/cart/${data.Id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: updatedData
            });
        } catch {
        }
    }

    const showConfirm = (mes: string) => {
        setContentModal(mes);
        setOpen(true);
    }

    const handleDelete = async () => {
        try {
            setConfirmLoading(true);
            await sendRequest<IOdataRes<ICart>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/cart/${data.Id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
        } catch {
        } finally {
            setConfirmLoading(false);
            setOpen(false);
            await data.onDeleted?.();
        }
    }

    return (
        <div className='w-full h-fit flex justify-between'>
            <div className='flex items-start space-x-8'>
                <div className='flex space-x-6'>
                    <img
                        className='w-24 h-24 bg-white rounded'
                        src={data?.ImageUri || ""} alt="Cart image" />
                    <div>
                        <div className='flex space-x-4 items-center'>
                            <Link href={""}>
                                <p className='text-lg'>{data.Product.Name}</p>
                            </Link>
                            {/* <span className='text-xs bg-[#EF4444] px-2 py-0.5 rounded-lg'>-33%</span> */}
                        </div>
                        <Link href={""}>
                            <p className='font-light'>{shop?.ShopName}</p>
                        </Link>

                        <div className='p-2'>
                            <p className='font-light text-xs'>Product option: {[option?.Color, option?.Type].filter(Boolean).join(" - ")}</p>
                            {
                                variant ? (
                                    <>
                                        <p className='font-light text-xs'>Product variant: {variant.Size?.Size}</p>
                                        <p className='font-light text-xs'>In stock: {variant.Quantity || "N/A"}</p>
                                    </>

                                ) : (
                                    <>
                                        <p className='font-light text-xs'>In stock: {option?.Quantity || "N/A"}</p>
                                    </>
                                )
                            }

                        </div>
                        <div className='py-2 flex space-x-2 items-end'>
                            <span className='text-xl text-[#EF4444] font-bold'>{formatCurrencyVND(variant?.Price || option?.Price || data.Product.Price || 0)}</span>
                            {/* <span className='text-sm line-through'>1.500.000đ</span> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-32 flex flex-col justify-between space-y-2 items-end'>
                <button onClick={() => showConfirm('Are your sure delete this item?')} className='text-[#F87171]'>
                    <FaTrashCan />
                </button>
                <div className='flex space-x-2'>
                    <button
                        onClick={() => handleUpdateQuantity(-1)}
                        className='p-1 text-center bg-[#B17AEA] rounded-md'>
                        <FaMinus />
                    </button>
                    <input
                        className='text-center w-16 outline-none pointer-events-none bg-[rgb(28,27,51)]'
                        type="text"
                        value={quantity} readOnly />
                    <button
                        onClick={() => handleUpdateQuantity(1)}
                        className='p-1 text-center bg-[#B17AEA] rounded-md'
                        disabled={quantity >= (variant?.Quantity || option?.Quantity || 0)}>
                        <FaPlus />
                    </button>
                </div>
            </div>
            <Modal
                title="Confirm delete"
                open={open}
                closeIcon={false}
                centered
                footer
            >
                <div className='space-y-2'>
                    <p>{contentModal}</p>
                    <div className='flex justify-end space-x-4'>
                        <button
                            onClick={() => setOpen(false)}
                            className='border rounded-lg p-2 px-4 text-black hover:text-black hover:border-blue-600'>
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete()}
                            className='flex items-center space-x-1 border rounded-lg p-2 px-4 bg-blue-600 text-white hover:text-white hover:border-white'>
                            <Spin spinning={confirmLoading} indicator={<LoadingOutlined style={{ color: 'white' }} spin />}>
                            </Spin>
                            <span>Ok</span>
                        </button>
                    </div>
                </div>

            </Modal>
        </div>
    )
}

export default CartItem