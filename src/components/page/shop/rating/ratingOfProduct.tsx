import RatingItem from '@/components/page/shop/rating/ratingItem';
import Link from 'next/link'
import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

const RatingOfProduct = () => {
    return (
        <div className='my-4 p-2 rounded-md bg-[#1C1B33] text-white'>
            <div className='flex items-center justify-between'>
                <p className='text-xl font-bold'>Product reviews <span className='text-base font-light'>(1234 rating)</span></p>
                <Link className='p-2 bg-[#C04FD4] rounded-lg font-light flex items-center space-x-1 text-sm' href="">
                    <p>View all</p>
                    <FaArrowRightLong />
                </Link>
            </div>
            <div className='mt-3 flex flex-col space-y-2'>
                <RatingItem />
                <RatingItem />
                <RatingItem />
                <RatingItem />
            </div>
        </div>
    )
}

export default RatingOfProduct