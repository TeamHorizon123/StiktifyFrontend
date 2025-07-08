"use client";

import useFetchListOData from '@/modules/shop/useFetchOdataList';
import { Pagination, Table } from 'antd';
import React, { useEffect, useState } from 'react'

const columns = [
    {
        title: 'Product name',
        dataIndex: 'name',
        Key: 'name'
    },
    {
        title: 'Product image',
        dataIndex: 'image',
        Key: 'image'
    },
    {
        title: 'Category',
        dataIndex: 'category',
        Key: 'category'
    },
    {
        title: 'Is active',
        dataIndex: 'active',
        Key: 'active'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        Key: 'action'
    },
];

const ManageProduct = ({ id }: Id) => {
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [page, setPage] = useState(0);
    const [products] = useFetchListOData<Product>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product/${id}/shop`,
        limit: 5,
        page: page,
        method: "GET"
    });

    const dataSource = products.map((product) => (
        {
            key: product.id,
            name: product.name,
            image: product.thumbnail,
            active: product.isActive,
            category: "N/A"
        }
    ))
    return (
        <div className='h-[100vh] bg-white'>
            <button className='m-2 text-white bg-black p-2 rounded'>Add new product</button>
            <Table
                style={{ marginTop: 8, backgroundColor: 'transparent' }}
                columns={columns}
                dataSource={dataSource}
            />
            <Pagination className='m-2' align="end" defaultCurrent={defaultCurrent} total={50} onChange={setPage} />
        </div>
    )

}

export default ManageProduct