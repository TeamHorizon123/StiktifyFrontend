"use client";

import { FaArrowRightLong, FaBolt } from "react-icons/fa6";
import Link from "next/link";
import Product from "@/components/page/shop/product/product";
import useFetchListOData from "@/modules/shop/useFetchOdataList";
interface IQueryParam {
    page: number
}

export default function ListProduct({ page }: IQueryParam) {
    const [products] = useFetchListOData<IProduct>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product`,
        limit: 8,
        method: "GET",
        page: page
    });

    return (
        <>
            <div className="w-3/4 m-auto mt-4 p-2">
                <div className="mb-2 flex justify-between">
                    <div className="flex items-center text-white space-x-2">
                        <FaBolt className="text-[#FB923C]" />
                        <p>Recommend</p>
                    </div>
                    {
                        (products.length > 0) ? (
                            <div className="flex text-[#C084FC] items-center space-x-2 text-sm">
                                <Link href="">View all</Link>
                                <FaArrowRightLong />
                            </div>
                        ) : (<></>)
                    }
                </div>
                <div className="min-w-full">
                    {products.length > 0 ? (
                        <div className="min-w-full grid grid-cols-4 gap-4">
                            {
                                products.map((product: IProduct) => (
                                    <Product key={product.Id} data={product} />
                                ))
                            }
                        </div>

                    ) : (
                        <>
                            <p className="text-center text-white grid grid-cols-1 text-lg">No products available at the moment. </p>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}