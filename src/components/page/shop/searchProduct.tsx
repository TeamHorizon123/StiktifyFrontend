"use client";

import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { formatCurrencyVND } from "@/utils/utils";
import { LoadingOutlined, StarFilled } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

export default function Search() {
    const { accessToken } = useContext(AuthContext) ?? {};
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setSearchValue("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchProduct = async () => {
            try {
                setLoading(true);
                const res = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `contains(tolower(Name), '${searchValue.toLowerCase()}') and IsHidden eq false`,
                        $orderby: "Order asc"
                    }
                });

                setProducts(res.value ?? [])
            } catch {
            } finally {
                setLoading(false);
            }
        }

        searchProduct();
    }, [accessToken, searchValue]);

    return (
        <>
            <div className="w-full mt-6 flex flex-col items-center justify-center relative" ref={wrapperRef}>
                <input
                    className="min-w-60 w-[30vw] outline-none py-1 px-2 bg-[#1C1B33] text-white border-[2px] border-[#454B79] rounded-lg"
                    type="search"
                    placeholder="Search product"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                {
                    searchValue && (
                        <div className="p-4 min-w-60 w-[30vw] h-[50vh] bg-[#1C1B33] absolute top-full mt-1 rounded-md shadow-lg z-10 overflow-y-auto">
                            {
                                loading ? (
                                    <div className="w-full h-full flex justify-center items-center">
                                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />} />
                                    </div>

                                ) : (
                                    <>
                                        {
                                            products.length == 0 ? (
                                                <Empty
                                                    description={<span className="text-white">Not found</span>}
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            ) : (<>
                                                {
                                                    products.map((product) => (
                                                        <div key={product.Id} className="hover:bg-[#1c1b3333]">
                                                            <Link
                                                                className="flex space-x-4 text-white rounded-md overflow-hidden hover:border-r"
                                                                href={`shop/product/${product.Id}`}>
                                                                <img
                                                                    width={75}
                                                                    src={product.ImageUri ?? ""}
                                                                    alt="product image" />
                                                                <div className="flex flex-col justify-center">
                                                                    <p>{product.Name}</p>
                                                                    <div className="flex items-center space-x-1 text-sm">
                                                                        <StarFilled style={{ color: "#FACC15" }} />
                                                                        <span>{product.AveragePoint ?? 0}</span>
                                                                        <span>({product.Order} sold)</span>
                                                                    </div>
                                                                    <p>{formatCurrencyVND(product.Price ?? 0)}</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </>)
                                        }
                                    </>
                                )
                            }

                        </div>
                    )
                }

            </div>

        </>
    )
}