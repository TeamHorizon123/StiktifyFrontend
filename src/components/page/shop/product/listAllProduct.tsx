"use client";

import Product from "@/components/page/shop/product/product"
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useContext, useEffect, useState } from "react";

interface IData {
    id: string | "",
    orderBy: string | "",
    skip: number | 0
}

const ListAllProduct = (data: IData) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const res = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `ShopId eq '${data.id}'`,
                        $count: true,
                        $skip: data.skip,
                        $top: 10
                    }
                });

                if (res.value) setProducts(res.value);

            } catch {
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, [accessToken, data]);

    if (loading)
        return (
            <div className="flex items-center justify-between h-28">
                <Spin indicator={<LoadingOutlined spin />} size="large" style={{ fontSize: 48, color: "white" }} />
            </div>
        )

    return (
        <div className="w-full py-2 grid grid-cols-5 gap-2">
            {
                products.length > 0 ? (
                    products.map((product) => (
                        <>
                            <Product data={product} />
                        </>
                    ))
                ) : (
                    <></>
                )
            }

        </div>
    )
}

export default ListAllProduct