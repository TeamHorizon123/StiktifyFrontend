import Link from 'next/link'
import React from 'react'
import { IoChatbox } from "react-icons/io5";
import { FaStar, FaProductHunt, FaRegCalendarDays } from "react-icons/fa6";

const ProductFooter = () => {
    return (
        <div className='my-4 p-2 rounded-md bg-[#1C1B33] text-white flex items-center'>
            <div className='w-3/4 flex'>
                <img className='w-20 h-20 bg-black' src="" alt="shop image" />
                <div className='p-2 flex flex-col justify-between'>
                    <div className='flex items-center space-x-2'>
                        <p className='text-lg'>Shop name</p>
                        <span className='text-xs bg-[#3B82F633] p-0.5 px-4 rounded-full'>Hot</span>
                    </div>
                    <div className='flex items-center text-lg space-x-4'>
                        <div className='flex items-center space-x-1'>
                            <FaStar className='text-yellow-500' />
                            <span className='text-xs font-light'>4.5</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <FaProductHunt />
                            <span className='text-xs font-light'>200 products</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <FaRegCalendarDays />
                            <span className='text-xs font-light'>Since May 2024</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-1/4 grid grid-cols-2 gap-2'>
                <Link className='h-fit p-2 flex space-x-2 items-center bg-[#C04FD4] justify-center rounded-lg border border-[#C04FD4] hover:border-white' href="">
                    <IoChatbox />
                    <span>Chat</span>
                </Link>
                <Link className='h-fit p-2 bg-[#18181B] text-center rounded-lg border border-[#18181B] hover:border-white' href="">
                    <span>View shop</span>
                </Link>
            </div>
        </div>
    )
}

export default ProductFooter