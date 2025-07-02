"use client";

import ListAllProduct from '@/components/page/shop/product/listAllProduct';
import { Dropdown, Pagination } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaStore, FaStar, FaUserCheck, FaListUl } from "react-icons/fa6";

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="">
                1st menu item
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="">
                2nd menu item
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="">
                3rd menu item
            </a>
        ),
    },
];

const StorePage = ({ id }: Id) => {
    const [current, setCurrent] = useState(3);

    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrent(page);
    };

    return (
        <div className='w-full h-fit '>
            <div className='flex bg-gradient-to-b from-[#1C1B33] to-[#2E335A] shadow-[#0C103380] shadow-sm'>
                <div className='w-[35%] p-3 flex space-x-3'>
                    <img
                        className='w-20 h-20 bg-white rounded-full'
                        src=""
                        alt="store image" />
                    <div>
                        <p className='text-white text-2xl'>Shop name</p>
                        <span className='px-2 py-0.5 text-sm rounded-lg text-[#60A5FA] bg-[#3B82F633]'>Favorite</span>
                    </div>
                </div>
                <div className='w-[65%] p-2 grid grid-cols-2 text-white'>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaStore />
                        <p>Products: 123</p>
                    </div>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaStar />
                        <Link href={""}>
                            <p className='hover:text-[#FACC15]'>Rating: 10k</p>
                        </Link>
                    </div>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaUserCheck />
                        <p>Participate: 2 Month ago</p>
                    </div>
                </div>
            </div>
            <div className='w-[80vw] m-auto flex text-white py-5 space-x-4 '>
                <div>
                    <p className='flex items-center space-x-2 text-lg pb-4'><FaListUl /> <span>Category</span> </p>
                    <hr />
                    <ul className='py-4 font-light'>
                        <li className='p-1'>
                            <Link href="">T-Shirt</Link>
                        </li>
                        <li className='p-1'>
                            <Link href="">Shirt</Link>
                        </li>
                        <li className='p-1'>
                            <Link href="">Summer clothes</Link>
                        </li>
                    </ul>
                </div>
                <div className='w-full items-center flex flex-col'>
                    <div className='w-full p-3 bg-[#1C1B33] rounded-t-lg flex items-center space-x-4'>
                        <p>Sort by:</p>
                        <button
                            className='p-1 px-3 bg-[#454B79] border-2px border-[#454B79] rounded-md'>
                            Common
                        </button>
                        <button
                            className='p-1 px-3 bg-[#1C1B33] border-[2px] border-[#454B79] hover:bg-[#454B79] rounded-md'>
                            Best sell
                        </button>
                        <button
                            className='p-1 px-3 bg-[#1C1B33] border-[2px] border-[#454B79] hover:bg-[#454B79] rounded-md'>
                            Newest
                        </button>
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <button>bottomRight</button>
                        </Dropdown>
                    </div>
                    <ListAllProduct data={null} />
                    <Pagination current={current} onChange={onChange} total={50} />
                </div>
            </div>
        </div>
    )
}

export default StorePage