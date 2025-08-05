"use client";

import { FaArrowRightLong, FaBolt } from "react-icons/fa6";
import Link from "next/link";
import Product from "@/components/page/shop/product/product";
import { useContext, useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

export default function ListProduct() {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[] | []>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        const getProducts = async () => {
            try {
                const res = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: 'IsHidden eq false',
                        $top: 8,
                        $skip: 0,
                        $count: true
                    }
                });

                if (res.value) setProducts(res.value);
                setTotal(res["@odata.count"] ?? 0);
            } catch {
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, [accessToken]);

    if (loading)
        return (
            <div className="w-full h-[80vh] text-white flex flex-col items-center justify-center space-y-4">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: 'white' }} spin />} />
                <span className="font-bold uppercase">Loading products...</span>
            </div>
        );

    return (
        <>
            <div className="w-3/4 m-auto mt-4 p-2">
                <div className="mb-2 flex justify-between">
                    <div className="flex items-center text-white space-x-2">
                        <FaBolt className="text-[#FB923C]" />
                        <p>Recommend</p>
                    </div>
                    {
                        (total > 8) ? (
                            <div className="flex text-[#C084FC] items-center space-x-2 text-sm">
                                <Link href="shop/recommend">View more</Link>
                                <FaArrowRightLong />
                            </div>
                        ) : (<></>)
                    }
                </div>
                <div className="min-w-full">
                    {products.length > 0 ? (
                        <div className="min-w-full grid grid-cols-4 gap-4">
                            {
                                products.map((product: Product) => (
                                    <Product key={product.Id} data={product} />
                                ))
                            }
                        </div>

                    ) : (
                        <>
                            <Empty description={false} />
                            <p className="text-center text-white grid grid-cols-1 text-lg">No products available at the moment.</p>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}