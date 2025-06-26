import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FaCartShopping, FaRegHeart } from "react-icons/fa6";

export default function Product() {
    return (
        <>
                    <div className="bg-[#1C1B33] rounded-md overflow-hidden">
                        <div className="h-56 bg-gray-500 relative">
                            <div className="w-full text-center absolute space-y-1 top-1 left-1">
                                <p className="w-[30%] min-w-fit bg-[#EF4444] rounded-lg p-1 text-xs">-33.33%</p>
                                <p className="w-[30%] min-w-fit bg-[#EAB308] rounded-lg p-1 text-xs">🔥 HOT</p>
                            </div>
                            <div className="absolute right-1 top-1">
                                <button className="w-fit h-fit p-2 bg-[#FFFFFF33] rounded-full border border-[#FFFFFF4D]">
                                    <FaRegHeart className="text-white" />
                                </button>
                            </div>
                            <img
                                src=""
                                alt="product image" />
                        </div>
                        <div className="p-2 text-white">
                            <Link href="" >Lorem ipsum dolor sit amet</Link>
                            <div className="my-2 flex items-center space-x-1">
                                <FaStar className="text-sm text-[#FACC15]" />
                                <p className="text-xs">4.8</p>
                                <p className="text-xs">(400 sold)</p>
                            </div>
                            <div className="my-4 flex space-x-2 flex-wrap">
                                <p className="text-xl font-bold text-red-500">1.000.000đ</p>
                                <span className="font-light line-through">1.500.000đ</span>
                            </div>
                            <button
                                className="w-full h-fit p-2 justify-center items-center bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex space-x-2 rounded-lg"
                                type="button">
                                <FaCartShopping />
                                <p>Add to cart</p>
                            </button>
                        </div>
                    </div>
        </>
    )
}