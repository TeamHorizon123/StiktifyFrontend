import Link from 'next/link';
import React from 'react'
import { FaTrashCan, FaMinus, FaPlus } from "react-icons/fa6";

const CartItem = () => {
    return (
        <div className='w-full h-full p-3 bg-[rgb(28,27,51)] rounded-md flex justify-between items-start'>
            <div className='flex items-start space-x-8'>
                <input className='cursor-pointer' type="checkbox" name="" id="" />
                <div className='flex space-x-6'>
                    <img
                        className='w-24 h-24 bg-white rounded'
                        src="" alt="Cart image" />
                    <div>
                        <div className='flex space-x-4 items-center'>
                            <Link href={""}>
                                <p className='text-lg'>Product name</p>
                            </Link>
                            <span className='text-xs bg-[#EF4444] px-2 py-0.5 rounded-lg'>-33%</span>
                        </div>
                        <Link href={""}>
                            <p className='font-light'>Shop name</p>
                        </Link>

                        <div className='p-2'>
                            <p className='font-light text-xs'>Product option</p>
                            <p className='font-light text-xs'>In stock: 100</p>
                        </div>
                        <div className='py-2 flex space-x-2 items-end'>
                            <span className='text-xl text-[#EF4444] font-bold'>1.000.000đ</span>
                            <span className='text-sm line-through'>1.500.000đ</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-32 flex flex-col justify-between space-y-2 items-end'>
                <button className='text-[#F87171]'>
                    <FaTrashCan />
                </button>
                <div className='flex space-x-2'>
                    <button className='p-1 text-center bg-[#B17AEA] rounded-md'>
                        <FaMinus />
                    </button>
                    <input
                        className='text-center w-16 outline-none pointer-events-none bg-[rgb(28,27,51)]'
                        type="text"
                        value={1} readOnly />
                    <button className='p-1 text-center bg-[#B17AEA] rounded-md'>
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartItem