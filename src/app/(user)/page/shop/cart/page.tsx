"use client";

import CartItem from '@/components/page/shop/cart/cartItem';
import { AuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { sendRequest } from '@/utils/api';
import { formatCurrencyVND } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Checkbox, Empty, Spin, } from 'antd';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { FaArrowLeftLong, FaCartShopping } from "react-icons/fa6";

const CartPage = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectItem, setSelectItem] = useState<ICart[]>([]);
    const [carts, setCarts] = useState<ICart[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const { selectedItems, setSelectedItems } = useCart();
    const router = useRouter();
    // const [shipFee, setShipFee] = useState(0);

    const getCarts = async () => {
        try {
            setLoading(true);
            const res = await sendRequest<IListOdata<ICart>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/cart/`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `UserId eq '${user?._id}'`,
                    $count: true,
                    $orderby: 'CreateAt asc',
                    $expand: 'Product, Option, Variant'
                }
            });

            if (res.value) setCarts(res.value);
            if ('@odata.count' in res) {
                setTotal(res['@odata.count'] ?? 0);
            } else {
                setTotal(res.value?.length ?? 0); // fallback
            }

        } catch {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCarts();
    }, [accessToken, user]);

    useEffect(() => {
        const total = selectItem.reduce(
            (sum, item) => sum + (item.Variant.Price || item.Option.Price || item.Product?.Price || 0) * item.Quantity,
            0
        );
        // if (selectItem.length > 0) setShipFee(50000);
        // else setShipFee(0);
        setSubTotal(total);
    }, [selectItem]);

    if (loading)
        return (
            <div className="w-full h-[80vh] main-layout text-white flex flex-col items-center justify-center space-y-4">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: 'white' }} spin />} />
                <span className="font-bold uppercase">Loading cart...</span>
            </div>
        )

    return (
        <div className='text-white p-4 main-layout min-h-screen'>
            <Link
                className='flex items-center space-x-2 hover:underline'
                href="/page/shop">
                <FaArrowLeftLong />
                <p className='font-light text-sm'>Back to Shop home</p>
            </Link>
            <div>
                <div className='py-4 flex items-center space-x-2'>
                    <FaCartShopping className='text-3xl' />
                    <div>
                        <p className='font-black text-3xl'>SHOPPING CART</p>
                        <p className='font-light'>{total} items in your cart</p>
                    </div>
                </div>
                {
                    total != 0 ? (
                        <div className='flex space-x-2'>
                            <div className='w-full flex space-x-2'>
                                <div className=' w-full'>
                                    <div className='w-full p-2 flex justify-between items-center space-x-2 bg-[#1C1B33] rounded-md'>
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                onChange={() => {
                                                    if (selectItem.length === carts.length) setSelectItem([]);
                                                    else setSelectItem(carts);
                                                }}
                                                checked={selectItem.length === carts.length && carts.length > 0}
                                                className='cursor-pointer text-white'>Select all</Checkbox>
                                        </div>

                                        {/* <button className='flex items-center space-x-2 text-[#F87171] hover:underline'>
                                            <FaTrashCan />
                                            <p>Delete all</p>
                                        </button> */}
                                    </div>

                                    <div className='mt-4 space-y-1'>
                                        {
                                            carts.map((cart) => (
                                                <div
                                                    className='w-full h-full p-3 bg-[rgb(28,27,51)] rounded-md flex items-start justify-start space-x-3'
                                                    key={cart.Id}>
                                                    <Checkbox
                                                        checked={selectItem.some(item => item.Id === cart.Id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectItem((prev) => [...prev, cart]);
                                                            } else {
                                                                setSelectItem((prev) => prev.filter(item => item.Id !== cart.Id));
                                                            }
                                                        }}
                                                        className='cursor-pointer' type="checkbox" />
                                                    <CartItem
                                                        key={`${cart.Id}-${cart.CreateAt}`}
                                                        {...cart}
                                                        onDeleted={getCarts}
                                                    />
                                                </div>

                                            ))
                                        }

                                    </div>
                                </div>
                            </div>
                            {

                                <div className='p-4 w-[30vw] h-fit bg-[#1C1B33] rounded-lg flex flex-col'>
                                    <p className='text-xl font-bold'>Order summary</p>
                                    <hr />
                                    <div className='py-3'>
                                        <div className='flex items-center justify-between'>
                                            <p className=' text-sm font-light'>Subtotal ({selectedItems.length} items)</p>
                                            <p className=' text-base font-light'>{formatCurrencyVND(subTotal)}</p>
                                        </div>
                                        {/* <div className='flex items-center justify-between'>
                                            <p className=' text-sm font-light'>Shipping</p>
                                            <p className=' text-base font-light'>{formatCurrencyVND(shipFee)}</p>
                                        </div> */}
                                    </div>
                                    <hr />
                                    <div className='py-2 flex items-center justify-between'>
                                        <p className=' text-base font-normal'>Total</p>
                                        <p className=' text-base font-light'>{formatCurrencyVND(subTotal)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedItems(selectItem)
                                            router.push('check-out');
                                        }}
                                        disabled={selectItem.length < 1}
                                        className='w-full m-auto text-center bg-[#18181B] p-2 rounded-md hover:border '>
                                        Process to checkout
                                    </button>
                                </div>
                            }

                        </div>

                    ) : (<>
                        <div className='w-full h-[50vh] flex flex-col items-center justify-center space-y-4'>
                            <div className='flex flex-col'>
                                <Empty description="" />
                                <span>There are no items in this cart</span>
                            </div>

                            <Link className='p-2 border rounded-xl hover:bg-[rgba(255,255,255,0.2)]' href="/page/shop">Continue shopping</Link>
                        </div>
                    </>)
                }
            </div>
        </div >
    )
}

export default CartPage