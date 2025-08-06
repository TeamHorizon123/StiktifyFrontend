"use client";

import ListAllProduct from '@/components/page/shop/product/listAllProduct';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { timeAgo } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Pagination, Spin } from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { FaStore, FaStar, FaUserCheck, FaListUl } from "react-icons/fa6";



const StorePage = () => {
    const { id } = useParams();
    const { accessToken } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    const [shop, setShop] = useState<Shop | null>(null);
    const [totalProduct, setTotalProduct] = useState(0);
    const [orderBy, setOrderBy] = useState<string>("Order desc");
    const [skip, setSkip] = useState(0);
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <button rel="noopener noreferrer" onClick={() => setOrderBy("RangePrice asc")}>
                    Price: Cheap to Expensive
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button rel="noopener noreferrer" onClick={() => setOrderBy("RangePrice desc")}>
                    Price: Expensive to Cheap
                </button>
            ),
        },
        {
            key: '3',
            label: (
                <button rel="noopener noreferrer" onClick={() => setOrderBy("CreateAt asc")}>
                    Newest product
                </button>
            ),
        },
    ];

    useEffect(() => {
        const getShop = async () => {
            try {
                setLoading(true);
                const res = await sendRequest<IListOdata<Shop>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `Id eq '${id}'`
                    }
                });

                const resCount = await sendRequest<IListOdata<Product>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `ShopId eq '${id}'`,
                        $count: true
                    }
                });

                if (res.value) setShop(res.value[0]);
                if (resCount['@odata.count']) setTotalProduct(resCount['@odata.count']);
            } catch {
            }
            finally {
                setLoading(false);
            }
        }

        getShop();
    }, [accessToken, id]);

    if (loading)
        return (
            <>
                <div className="w-full h-[80vh] text-white flex flex-col items-center justify-center space-y-4">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: 'white' }} spin />} />
                    <span className="font-bold uppercase">Loading store...</span>
                </div>
            </>
        )

    return (
        <div className='w-full h-fit '>
            <div className='flex bg-gradient-to-b from-[#1C1B33] to-[#2E335A] shadow-[#0C103380] shadow-sm'>
                <div className='w-[35%] p-3 flex space-x-3'>
                    <img
                        className='w-20 h-20 bg-white rounded-full'
                        src={shop?.AvatarUri || ""}
                        alt="store image" />
                    <div>
                        <p className='text-white text-2xl'>{shop?.ShopName}</p>
                        {
                            shop?.ShopType ? (<span className='px-2 py-0.5 text-sm rounded-lg text-[#60A5FA] bg-[#3B82F633]'>{shop?.ShopType}</span>) : (<></>)
                        }

                    </div>
                </div>
                <div className='w-[65%] p-2 grid grid-cols-2 text-white'>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaStore />
                        <p>Products: {totalProduct}</p>
                    </div>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaStar />
                        <Link href={""}>
                            <p className='hover:text-[#FACC15]'>Rating: {shop?.AveragePoint}</p>
                        </Link>
                    </div>
                    <div className='flex items-center space-x-2 text-base'>
                        <FaUserCheck />
                        <p>Participate: {timeAgo(shop?.CreateAt?.toString() || "")}</p>
                    </div>
                </div>
            </div>
            <div className='w-[80vw] m-auto flex text-white py-5 space-x-4 '>
                <div className='w-full items-center flex flex-col'>
                    <div className='w-full p-3 bg-[#1C1B33] rounded-t-lg flex items-center space-x-4'>
                        <p>Sort by:</p>
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <button>Select option</button>
                        </Dropdown>
                    </div>
                    <ListAllProduct id={id.toString()} orderBy={orderBy} skip={skip} />
                </div>
            </div>
        </div>
    )
}

export default StorePage