"use client";

import { FaArrowRightLong, FaBolt } from "react-icons/fa6";
import Link from "next/link";
import Product from "@/components/page/shop/product/product";
import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";


interface IQueryParam {
    skip: string,
    top: string
}

export default function ListProduct({ top, skip }: IQueryParam) {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [products, setListProduct] = useState<IProduct[]>([]);

    const GetAllProduct = async () => {
        // console.log(accessToken);

        // if (!accessToken) {
        //     return;
        // }
        try {
            const res = await sendRequest<IListProduct>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product`,
                queryParams: {
                    $top: top || 8,
                    $skip: skip || 0
                },
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            setListProduct(res.value || []);
        } catch (error) {
            console.log("Error get all product: ", error);
        }
    }

    useEffect(() => {
        // console.log(products);

        GetAllProduct();
    }, [accessToken, top, skip]);
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