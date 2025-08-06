import Link from 'next/link'
import React, { useContext } from 'react'
import { FaStar, FaRegCalendarDays } from "react-icons/fa6";
import { formatMonthYear } from '@/utils/utils';
import { AuthContext } from '@/context/AuthContext';

interface ShopInfo {
    data: Shop | null
}

const ProductFooter = ({ data }: ShopInfo) => {
    const { user } = useContext(AuthContext) ?? {};

    if (data)
        return (
            <div className='my-4 p-2 rounded-md bg-[#1C1B33] text-white flex items-center'>
                <div className='w-3/4 flex'>
                    <img className='w-20 h-20 bg-black rounded-md' src={data.AvatarUri || ""} alt="shop image" />
                    <div className='p-2 flex flex-col justify-between'>
                        <div className='flex items-center space-x-2'>
                            <p className='text-lg'>{data.ShopName}</p>
                            {
                                (!data.ShopType) ? (<></>) : (
                                    <span className='text-xs bg-[#3B82F633] p-0.5 px-4 rounded-full'>{data.ShopType}</span>
                                )
                            }

                        </div>
                        <div className='flex items-center text-lg space-x-4'>
                            <div className='flex items-center space-x-1'>
                                <FaStar className='text-yellow-500' />
                                <span className='text-xs font-light'>{data.AveragePoint}</span>
                            </div>
                            {/* <div className='flex items-center space-x-1'>
                                <FaProductHunt />
                                <span className='text-xs font-light'>200 products</span>
                            </div> */}
                            <div className='flex items-center space-x-1'>
                                <FaRegCalendarDays />
                                <span className='text-xs font-light'>Since {formatMonthYear(data.CreateAt + "")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-1/4 flex items-center justify-end'>
                    {/* <Link
                        className='h-fit p-2 flex space-x-2 items-center bg-[#C04FD4] justify-center rounded-lg border border-[#C04FD4] hover:border-white'
                        href="">
                        <IoChatbox />
                        <span>Chat</span>
                    </Link> */}
                    <Link
                        className='h-fit p-2 bg-[#18181B] text-center rounded-lg border border-[#18181B] hover:border-white'
                        href={data.Id != user?._id ? `/page/shop/store/${data.Id}` :"/page/store"}>
                        <span>View shop</span>
                    </Link>
                </div>
            </div>
        )
    else
        return (<p>Not found</p>)
}

export default ProductFooter