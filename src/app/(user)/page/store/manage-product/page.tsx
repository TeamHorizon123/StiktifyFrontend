"use client";

import ModalAddProduct from '@/components/modal/modal.add.product';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Image, Modal, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

const columns = [
    {
        title: 'Product name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Product image',
        dataIndex: 'image',
        key: 'image',
        render: (imageUri: string) => (
            <Image height={'60px'} alt='product image' src={imageUri} />
        )
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category'
    },
    {
        title: 'Is active',
        dataIndex: 'active',
        key: 'active'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
    },
];

const ManageProduct = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [skip, setSkip] = useState(0);
    const [top, setTop] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [dataSource, setDataSource] = useState<object[]>([]);
    const [page, setPage] = useState(1);
    const [shop, setShop] = useState<Shop>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!accessToken) return;
        const getShop = async () => {
            const res = await sendRequest<IListOdata<Shop>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/shop`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `UserId eq '${user?._id}'`
                }
            });
            if (res.value) setShop(res.value[0]);
        }

        getShop();
        console.log(shop);

    }, [accessToken, user]);


    const getProducts = async (skip: number, top: number) => {
        if (!shop) return;
        const res = await sendRequest<IListOdata<Product>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            queryParams: {
                $filter: `ShopId eq '${shop?.Id}'`,
                $top: top,
                $skip: skip,
                $count: true
            }
        });
        if (res.value) {
            setProducts(res.value);
            setTotal(res['@odata.count'] || 0);
        }
    }

    useEffect(() => {
        getProducts(skip, top);
        setLoading(false);
    }, [shop])

    useEffect(() => {

        const updateData = () => {
            const data = products.map((product) => (
                {
                    key: product?.Id,
                    name: product?.Name,
                    image: product?.ImageUri,
                    active: product?.IsHidden,
                    category: "N/A"
                }
            ))
            setDataSource(data);
            setDefaultCurrent(1);
        }

        updateData();
    }, [products]);

    const handleShowModal = (e: boolean) => {
        setShowModal(e);
    }

    return (
        <div className='h-[100vh] bg-white'>
            <button className='m-2 text-white bg-black p-2 rounded' onClick={() => { handleShowModal(true) }}>Add new product</button>
            <Table
                style={{ marginTop: 8, backgroundColor: 'transparent' }}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    current: skip / top + 1,
                    total: total,
                    pageSize: top,
                    defaultCurrent: defaultCurrent,
                    onChange: async (page, pageSize) => {
                        const newSkip = (page - 1) * pageSize;
                        setSkip(newSkip);
                        await getProducts(newSkip, top);
                    },
                }}
            />
            <Modal
                title={"Add new product"}
                footer={null}
                onCancel={() => handleShowModal(false)}
                destroyOnClose={true}
                visible={showModal}>
                <ModalAddProduct id={shop?.Id || ""} />
            </Modal>
        </div>
    )

}

export default ManageProduct