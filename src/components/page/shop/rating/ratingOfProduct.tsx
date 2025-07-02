"use client";

import RatingItem from '@/components/page/shop/rating/ratingItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

interface IProp {
    id: string
}

const RatingOfProduct = ({ id }: IProp) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [ratings, setRatings] = useState<IProductRating[]>([]);
    const [countRate, setCountRate] = useState(0);

    useEffect(() => {
        const getListRating = async () => {
            try {
                const res = await sendRequest<IListOdata<IProductRating>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product-rating/${id}/product`,
                    method: "GET",
                    queryParams: {
                        $top: 4,
                        $skip: 0,
                        $count: true
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })

                if (res.value) setRatings(res.value);
                if (res['@odata.count']) setCountRate(res['@odata.count']);
            } catch {
            }
        }

        getListRating();
    }, [accessToken]);

    console.log(ratings.length < 1);

    return (
        <div className='my-4 p-2 rounded-md bg-[#1C1B33] text-white'>
            <div className='flex items-center justify-between'>
                <p className='text-xl font-bold'>Product reviews <span className='text-base font-light'>({countRate} rating)</span></p>
                {
                    (ratings.length > 1) ? (
                <Link className='p-2 bg-[#C04FD4] rounded-lg font-light flex items-center space-x-1 text-sm' href="">
                    <p>View all</p>
                    <FaArrowRightLong />
                </Link>
                ) : (<></>)
                }
            </div>
            <div className='mt-3 flex flex-col space-y-2'>
                {
                    ratings.map((rating) => (
                        <RatingItem
                            key={rating.id}
                            id={rating.id}
                            content={rating.content}
                            image={rating.image}
                            point={rating.point}
                            userId={rating.userId}
                            createAt={rating.createAt}
                            optionId={rating.optionId}
                            updateAt={rating.updateAt}
                            productId={rating.productId} />
                    ))
                }
            </div>
        </div>
    )
}

export default RatingOfProduct