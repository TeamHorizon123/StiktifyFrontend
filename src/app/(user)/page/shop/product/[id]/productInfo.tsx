import ProductImage from '@/components/page/shop/product/productImage'
import React from 'react';
import { FaStar, FaStarHalf, FaCartPlus } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FaMinus, FaPlus } from "react-icons/fa";
import ProductFooter from '@/components/page/shop/product/productFooter';
import ProductDescription from '@/components/page/shop/product/productDescription';
import RatingOfProduct from '@/components/page/shop/rating/ratingOfProduct';

const ProductInfo = () => {
    return (
        <div>
            <div className='grid grid-cols-2'>
                <ProductImage />
                <div className='flex flex-col px-2 text-white'>
                    <p className='text-3xl font-bold'>Product name</p>
                    <div className='flex items-center space-x-3 font-light text-sm py-3'>
                        <div className='flex items-center space-x-1'>
                            <span className='flex text-yellow-500 space-x-1'>
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStarHalf />
                            </span>
                            <p>4.5</p>
                            <p>(150 reviews)</p>
                        </div>
                        <GoDotFill />
                        <span>12k orders</span>
                    </div>
                    <div className='py-5 flex items-center space-x-3'>
                        <span className='text-4xl font-bold'>100.000.000đ</span>
                        <span className='text-lg font-light line-through'>150.000.000đ</span>
                    </div>
                    <div className='w-full py-4 flex space-x-2 justify-between'>
                        <span>Option:</span>
                        <div className='w-full grid grid-cols-3 gap-3'>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                            <button className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center'>
                                <img className='bg-black w-[40%] h-full text-sm' src="" alt="option image" />
                                <span className='text-xs text-wrap text-center'>Option value</span>
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center space-x-5'>
                        <span>Quantity:</span>
                        <div className='flex items-center space-x-4'>
                            <button className='p-2 text-xl bg-[#C04FD4] rounded-lg' disabled><FaMinus /></button>
                            <span className='text-2xl px-2'>1</span>
                            <button className='p-2 text-xl bg-[#C04FD4] rounded-lg'><FaPlus /></button>
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
            <ProductFooter />
            <ProductDescription />
            <RatingOfProduct />
        </div>
    )
}

export default ProductInfo