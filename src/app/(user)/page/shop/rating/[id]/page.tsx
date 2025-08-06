"use client";

import RatingItem from '@/components/page/shop/rating/ratingItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Empty, Rate, Select } from 'antd'
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const RatingPage = () => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const { id } = useParams();
    const [option, setOption] = useState('');
    const [ratings, setRating] = useState<IProductRating[]>([]);
    const [product, setProduct] = useState<Product>();

    const getRating = async () => {
        try {
            const res = await sendRequest<IListOdata<IProductRating>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-rating`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `ProductId eq '${id}' ${option}`
                }
            })
            setRating(res.value ?? []);
        } catch (error) {
            console.error("load rating fail", error);
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${id}'`
                    }
                })

                setProduct(res.value[0]);

            } catch (error) {
                console.error("Load product fail", error);
            }
        }
        getProduct();
        getRating();
    }, [])

    useEffect(() => {
        getRating();
    }, [option])

    return (
        <div className='main-layout min-h-screen p-4'>
            <div className='py-4 w-[80vw] min-h-[90vh] m-auto text-white bg-[#454B79] rounded p-2'>
                <p className='text-lg uppercase'>Rating of product</p>
                <div className='flex items-center space-x-10'>
                    <div className='flex flex-col items-center justify-center '>
                        <p className='font-bold text-lg'>{product?.AveragePoint} on 5 star</p>
                        <Rate disabled value={product?.AveragePoint} allowHalf />
                    </div>
                    <Select
                        style={{ width: 120, backgroundColor: '#454B79', color: '#454B79' }}
                        defaultValue={''}
                        onChange={setOption}
                        options={[
                            {
                                label: "All",
                                value: ''
                            },
                            {
                                label: "5 star",
                                value: 'and Point eq 5'
                            },
                            {
                                label: "4 star",
                                value: 'and Point eq 4'
                            },
                            {
                                label: "3 star",
                                value: 'and Point eq 3'
                            },
                            {
                                label: "2 star",
                                value: 'and Point eq 2'
                            }, {
                                label: "1 star",
                                value: 'and Point eq 1'
                            }
                        ]}
                    />
                </div>
                <div className='mt-3 flex flex-col space-y-2'>
                    {
                        ratings.length < 1 && <Empty description={<p className='text-white'>No data</p>} />
                    }
                    {
                        ratings.map((rating) => (
                            <RatingItem
                                key={rating.Id} {...rating} />
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default RatingPage