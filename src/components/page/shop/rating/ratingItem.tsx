import Link from 'next/link';
import React from 'react'
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { BiLike, BiDislike } from "react-icons/bi";

const RatingItem = () => {
    return (
        <div className='p-2 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-md flex space-x-4'>
            <div className='w-16'>
                <img className='w-12 h-12 bg-black rounded-full' src="" alt="user logo" />
            </div>
            <div>
                <div className='flex items-center space-x-2'>
                    <Link href="">Username account</Link>
                    <div className='flex text-yellow-500 text-lg'>
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStar />
                        <IoIosStarHalf />
                        <IoIosStarOutline />
                    </div>
                    <p className='text-xs'>2025-05-24</p>
                </div>
                <p className='py-2 text-sm font-light text-[#D1D5DB]'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit veritatis magni voluptate quidem illo! Quaerat error quo suscipit molestiae. Quam dignissimos obcaecati impedit quasi, optio ad facere itaque dolores dolore.
                </p>
                <div className='w-full h-28 flex space-x-1'>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                </div>
                <div className='mt-2 flex space-x-8'>
                    <Link className='flex items-center space-x-1' href="">
                        <BiLike className='text-lg' />
                        <p className='text-sm font-light'>Helpful </p>
                    </Link>
                    <Link className='flex items-center space-x-2' href="">
                        <BiDislike className='text-lg' />
                        <p className='text-sm font-light'>Not helpful </p>
                    </Link>
                    <Link className='flex items-center space-x-2' href="">
                        <p className='text-sm font-light'>Reply </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RatingItem