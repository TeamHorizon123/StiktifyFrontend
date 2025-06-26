
import { FaArrowRightLong, FaBolt } from "react-icons/fa6";
import Link from "next/link";
import Product from "@/components/page/shop/product/product";

export default function ListProduct() {
    return (
        <>
            <div className="w-3/4 m-auto mt-4 p-2">
                <div className="mb-2 flex justify-between">
                    <div className="flex items-center text-white space-x-2">
                        <FaBolt className="text-[#FB923C]" />
                        <p>Recommend</p>
                    </div>
                    <div className="flex text-[#C084FC] items-center space-x-2 text-sm">
                        <Link href="">View all</Link>
                        <FaArrowRightLong />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                </div>
            </div>
        </>
    )
}