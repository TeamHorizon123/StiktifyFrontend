"use client";

import ModalAddProduct from '@/components/modal/modal.add.product';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Image, message, Modal, Table, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const ManageProduct = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [skip, setSkip] = useState(0);
    const [top, setTop] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [dataSource, setDataSource] = useState<object[]>([]);
    const [shop, setShop] = useState<Shop | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const router = useRouter();

    const columns = [
        {
            title: 'Product name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: any) => (
                <span
                    onClick={() => router.push(`manage-product/${record.key}`)}
                    className="text-blue-600 cursor-pointer hover:underline"
                >
                    {record.name}
                </span>
            )
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
            key: 'active',
            render: (status: boolean) => (<>
                {
                    (status) ? (<Tag color='green'>{status}</Tag>) :
                        (<Tag color='volcano'>{status}</Tag>)
                }
            </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleUpdate(record)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleToggleStatus(record)}
                        className={`${record.active !== true
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                            } text-white px-2 py-1 rounded`}
                    >
                        {record.active !== true ? "Disable" : "Enable"}
                    </button>
                </div>
            )
        }

    ];

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
                $count: true,
                $expand: "Category"
            }
        });

        console.log(res.value);

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
                    active: JSON.stringify(!product?.IsHidden) || "Unknown",
                    category: product.Category?.Name,
                    action: JSON.stringify(!product?.IsHidden)
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

    const handleUpdate = (record: any) => {
        console.log("Update product: ", record.key);
        // Mở lại modal và truyền ID
        setShowModalUpdate(true);
        // Có thể thêm props vào <ModalAddProduct id={...} mode="update" />
    };
    const handleToggleStatus = async (product: any) => {
        try {
            const updatedProduct = {
                ...product,
                IsHidden: !product.IsHidden
            };
            const res = await sendRequest<IBackendRes<Product>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}odata/product/${product.key}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: updatedProduct
            });
            if(res.statusCode === 200) message.success(res.message);
            await getProducts(skip, top); // refresh lại list
        } catch (err) {
            console.error("Toggle product active failed", err);
        }
    };


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