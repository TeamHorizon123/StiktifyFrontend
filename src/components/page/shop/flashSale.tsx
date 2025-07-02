import CountSaleTime from "@/components/page/shop/countTimeSale";
import SaleProduct from "@/components/page/shop/product/saleProduct";
import Link from "next/link";
import { FaArrowRightLong, FaFire } from "react-icons/fa6";

export default function FlashSale() {
    return (
        <>
            <div className="w-3/4 m-auto mt-4 p-2">
                <div className="mb-2 flex justify-between">
                    <div className="flex items-center text-white space-x-2">
                        <FaFire className="text-[#FB923C]" />
                        <p>Flash Sale</p>
                        <CountSaleTime />
                    </div>
                    <div className="flex text-[#C084FC] items-center space-x-2 text-sm">
                        <Link href="">View all</Link>
                        <FaArrowRightLong />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <SaleProduct/>
                    <SaleProduct/>
                    <SaleProduct/>
                    <SaleProduct/>
                </div>
            </div>
        </>
    )
}