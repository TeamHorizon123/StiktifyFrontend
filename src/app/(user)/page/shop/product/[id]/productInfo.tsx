"use client";

import ProductImage from '@/components/page/shop/product/productImage'
import React, { useContext, useEffect, useState } from 'react';
import { FaStar, FaStarHalf, FaCartPlus } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FaMinus, FaPlus } from "react-icons/fa";
import ProductFooter from '@/components/page/shop/product/productFooter';
import ProductDescription from '@/components/page/shop/product/productDescription';
import RatingOfProduct from '@/components/page/shop/rating/ratingOfProduct';
import { sendRequest } from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import { IoIosStarOutline } from "react-icons/io";
import { formatCurrencyVND } from '@/utils/utils';
import useFetchListOData from '@/modules/shop/useFetchOdataList';
import useFetchItem from '@/modules/shop/useFetchItem';

const ProductInfo = ({ id }: Id) => {
    const [loading, setLoading] = useState(true);
    const { accessToken } = useContext(AuthContext) ?? {};
    const [product, setProduct] = useState<Product | null>(null);
    const [options] = useFetchListOData<IProductOption>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product-option/${id}`,
        method: "GET",
        limit: 100,
        page: 1
    });
    const [quantity, setQuantity] = useState(1);
    const [choose, setChoose] = useState<IProductOption | null>(null);
    const { data: images } = useFetchItem<Images>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product/image/${id}`,
        method: "GET"
    })
    const [defaultImg, setDefaultImg] = useState(images?.listImage[0]);

    // Get data of product - [id]
    useEffect(() => {
        const getProduct = async () => {
            if (!id || !accessToken) {
                return;
            }
            try {
                const res = await sendRequest<Product>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product/get/${id}`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                if (res) setProduct(res);
            } catch {
            } finally {
                setLoading(false);
            }
        }

        getProduct();
        setChoose(null);
        setQuantity(1)
    }, [accessToken, id]);
    // End get data

    const handleUpdateQuantity = (value: number) => {
        setQuantity(quantity + value);
    }

    const handleChooseOption = (option: IProductOption) => {
        setChoose(option.Id === choose?.Id ? null : option);
        setDefaultImg(option.Id === choose?.Id ? images?.listImage[0] : option.Image);
    }

    useEffect(() => {
        setQuantity(1);
    }, [choose]);

    if (loading) return (<p className='text-white'>Loading data...</p>)
    return (
        <>
            {
                (product) ? (
                    <div >
                        <div className='grid grid-cols-2'>
                            <ProductImage
                                default={defaultImg || product.ImageUri}
                                listImage={images?.listImage || []} />
                            <div className='flex flex-col px-2 text-white'>
                                <p className='text-3xl font-bold'>{product.Name}</p>
                                <div className='flex items-center space-x-3 font-light text-sm py-3'>
                                    <div className='flex items-center space-x-1'>
                                        <span className='flex text-yellow-500 space-x-1'>
                                            {
                                                (product.AveragePoint <= 0) ? (<IoIosStarOutline />) : (<>
                                                    <FaStar />
                                                    <FaStar />
                                                    <FaStar />
                                                    <FaStar />
                                                    <FaStar />
                                                    {/* <FaStarHalf /> */}
                                                </>)
                                            }
                                        </span>
                                        <p>{product.AveragePoint}</p>
                                        {/* <p>({product.Order})</p> */}
                                    </div>
                                    <GoDotFill />
                                    <span>{product.Order} orders</span>
                                </div>
                                <div className='py-5 flex items-center space-x-3'>
                                    <span className='text-4xl font-bold'>{formatCurrencyVND(product.Price || 0)}</span>
                                </div>
                                <div className='w-full py-4 flex space-x-2 justify-between'>
                                    {
                                        options.length > 0 ? (<>
                                            <span>Option:</span>
                                            <div className='w-full grid grid-cols-3 gap-3'>
                                                {
                                                    options.map((option: IProductOption) => (
                                                        <>
                                                            {
                                                                option.Id === choose?.Id ? (
                                                                    <button
                                                                        key={option.Id}
                                                                        onClick={() => { handleChooseOption(option) }}
                                                                        className='overflow-hidden h-12 border border-[#C04FD4] bg-[#C04FD4] rounded-md flex items-center space-x-1'>
                                                                        <img className='bg-black w-[40%] h-full text-sm' src={option.Image} alt="option image" />
                                                                        <span className='text-xs text-wrap text-center'>{option.Attribute + "-" + option.Value}</span>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        key={option.Id}
                                                                        onClick={() => { handleChooseOption(option) }}
                                                                        className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center space-x-1'>
                                                                        <img className='bg-black w-[40%] h-full text-sm' src={option.Image} alt="option image" />
                                                                        <span className='text-xs text-wrap text-center'>{option.Attribute + "-" + option.Value}</span>
                                                                    </button>
                                                                )
                                                            }
                                                        </>

                                                    ))
                                                }
                                            </div></>) : (<></>)
                                    }

                                </div>
                                <div className='flex items-center space-x-5'>
                                    <span>Quantity:</span>
                                    <div className='flex items-center space-x-4'>
                                        <button
                                            className='p-2 text-xl bg-[#C04FD4] disabled:bg-[#C04FD480] rounded-lg'
                                            onClick={() => { handleUpdateQuantity(-1) }}
                                            disabled={quantity <= 1}><FaMinus /></button>
                                        <span className='text-2xl w-16 px-2 text-center'>{quantity}</span>
                                        <button
                                            className='p-2 text-xl bg-[#C04FD4] disabled:bg-[#C04FD480] rounded-lg'
                                            onClick={() => { handleUpdateQuantity(1) }}
                                            disabled={choose === null || quantity >= choose?.Quantity}><FaPlus /></button>
                                    </div>
                                </div>
                                <div className='py-4 grid grid-cols-2 gap-2'>
                                    <button className='p-3 rounded-md border border-[#18181B] hover:border-white bg-[#18181B] flex items-center justify-center space-x-2'>
                                        <FaCartPlus />
                                        <span>Add to cart</span>
                                    </button>
                                    <button className='p-3 rounded-md border border-[#C04FD4] hover:border-white bg-[#C04FD4] text-center'>
                                        <span>Buy now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ProductFooter id={product.shopId} />
                        <ProductDescription description={product.description} />
                        <RatingOfProduct id={product.id} />
                    </div >
                ) : (<>
                    <p>None data</p>
                </>)
            }
        </>
    )
}

export default ProductInfo