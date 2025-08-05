"use client";

import LoadingItem from '@/components/page/shop/loading/loadingItem';
import Product from '@/components/page/shop/product/product'
import Search from '@/components/page/shop/searchProduct'
import { AuthContext } from '@/context/AuthContext'
import { sendRequest } from '@/utils/api';
import { Empty } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { FaShop } from 'react-icons/fa6'

const RecommendPage = () => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[] | []>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const getProducts = async () => {
        if (!hasMore) return;
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
                    $skip: page * 8,
                    $count: true
                }
            });

            if (res.value) setProducts((prev) => [...prev, ...res.value]);
            setTotal(res["@odata.count"] ?? 0);
            setHasMore(res.value.length > 0);
            setPage(prev => prev + 1);
        } catch {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        setProducts([]);
        getProducts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;

            if (scrollY + viewportHeight >= fullHeight) {
                getProducts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading, hasMore]);

    return (
        <>
            <div className="w-3/4 m-auto mt-4 p-2">
                <div className="flex items-center justify-center text-white space-x-2 text-4xl font-black">
                    <FaShop />
                    <p className="">Stiktify Shop</p>
                </div>
                <Search />
                <div className="min-w-full mt-8">
                    {products.length > 0 ? (
                        <div className="min-w-full grid grid-cols-4 gap-4">
                            {
                                products.map((product: Product) => (
                                    <Product key={product.Id} data={product} />
                                ))
                            }
                            {
                                loading??<LoadingItem notifyLoading='Loading'/>
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

export default RecommendPage