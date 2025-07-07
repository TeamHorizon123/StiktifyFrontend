import CartItem from '@/components/page/shop/cart/cartItem';
import Link from 'next/link'
import React from 'react'
import { FaArrowLeftLong, FaCartShopping, FaTrashCan } from "react-icons/fa6";

const CartPage = () => {
    return (
        <div className='text-white'>
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
                        <p className='font-light'>3 items in your cart</p>
                    </div>
                </div>
                <div className='w-full flex space-x-2'>
                    <div className=' w-full'>
                        <div className='w-full p-2 flex justify-between items-center space-x-2 bg-[#1C1B33] rounded-md'>
                            <div className='flex items-center space-x-2'>
                                <input className='cursor-pointer' type="checkbox" name="" id="" />
                                <span>Select all</span>
                            </div>

                            <button className='flex items-center space-x-2 text-[#F87171] hover:underline'>
                                <FaTrashCan />
                                <p>Delete all</p>
                            </button>
                        </div>

                        <div className='mt-4'>
                            <CartItem />
                        </div>
                    </div>
                    <div className='p-4 w-[30vw] bg-[#1C1B33] rounded-lg flex flex-col'>
                        <p className='text-xl font-bold'>Order summary</p>
                        <hr />
                        <div className='py-3'>
                            <div className='flex items-center justify-between'>
                                <p className=' text-sm font-light'>Subtotal (0 items)</p>
                                <p className=' text-base font-light'>0đ</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className=' text-sm font-light'>Shipping</p>
                                <p className=' text-base font-light'>50.000đ</p>
                            </div>
                        </div>
                        <hr />
                        <div className='py-2 flex items-center justify-between'>
                            <p className=' text-base font-normal'>Total</p>
                            <p className=' text-base font-light'>50.000đ</p>
                        </div>
                        <Link className='w-full m-auto text-center bg-[#18181B] p-2 rounded-md hover:border '
                            href={""}>
                            Process to checkout
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CartPage