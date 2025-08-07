import { formatCurrencyVND } from "@/utils/utils";
import { Image } from "antd";
import Link from "next/link";
import React from "react";
import { FaStar } from "react-icons/fa";

interface IData {
    data: Product
}

const Product: React.FC<IData> = ({ data }) => {
    return (
        <div className="bg-[#1C1B33] rounded-md overflow-hidden relative">
            <div className="h-56 bg-gray-500 relative overflow-hidden">
                <div className="w-full h-20 absolute bg-gradient-to-b from-[rgba(0,0,0,0.8)] z-10"></div>
                {/* <div className="absolute  right-1 top-1 z-10">
                    <button title="Add to wishlist" className="w-fit h-fit p-2 bg-[#FFFFFF33] rounded-full border border-[#FFFFFF4D] ">
                        <FaRegHeart className="text-white" />
                    </button>
                </div> */}
                <Image
                    src={data.ImageUri || "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/506051651_122179336766349097_3072307640697660142_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFTfYdcV-8mYUUgAMk0YmXA7RjV0zze2j7tGNXTPN7aPviT8YhHdT0Po71M0VJPOgvNJogql8sU__qv-a-1R8Ec&_nc_ohc=GiVnHsZWNuoQ7kNvwFh9rbo&_nc_oc=Adlv8wQSGpQFea8Yg0QxQoPhjVn6DbVZ0WCqhWvA4xqkHAymOQxR0XRNSNedOzWxFbYDjKObxDyObUPWHeC0YdQb&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=WZ6IwdaaqDsrvNYALvUR6g&oh=00_AfMZiFgUFEv1xuwLz7ZIqlXq051FVosINKayeiBHaYkpNA&oe=6865A4E5"}
                    alt={data.Name || "Product image"}
                    title={data.Name || ""}
                    width="100%"
                />
            </div>
            <div className="p-2 text-white">
                <Link href={`/page/shop/product/${data.Id}`} >
                    <Link href={`/page/shop/product/${data.Id}`} >{data.Name}</Link>
                    <div className="my-2 flex items-center space-x-1">
                        <FaStar className="text-sm text-[#FACC15]" />
                        <p className="text-xs">{data.AveragePoint}</p>
                        <p className="text-xs">({data.Order} sold)</p>
                    </div>
                    <div className="my-4 flex space-x-2 flex-wrap">
                        <p className="text-xl font-bold text-red-500">
                            {
                                formatCurrencyVND(data.Price || 0)
                            }
                        </p>
                    </div>
                </Link>
                {/* <button
                    className="w-full h-fit p-2 justify-center items-center bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex space-x-2 rounded-lg"
                    type="button">
                    <FaCartShopping />
                    <p>Add to cart</p>
                </button> */}
            </div>
            {
                data.IsHidden&&
                <div className="absolute z-50 top-0 bottom-0 h-full w-full text-center flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-10"></div>
                    <span className="font-bold text-xl p-3 bg-black rounded-lg">Out Stock</span>
                </div>
            }
        </div>
    )
}
export default Product