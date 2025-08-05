"use client";

import ModalAddProduct from '@/components/modal/modal.add.product';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Image, Input, Modal, Select, Table, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const ManageProduct = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [skip, setSkip] = useState(0);
    const [top] = useState(4);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [dataSource, setDataSource] = useState<object[]>([]);
    const [shop, setShop] = useState<Shop | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [orderBy, setOrderBy] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    // const [showModalUpdate, setShowModalUpdate] = useState(false);
    const router = useRouter();

    const columns = [
        {
            title: 'Product name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: any) => (
                <span
                    onClick={() => router.push(`manage-product/${record.key}`)}
                    className="cursor-pointer hover:underline"
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

    ];

    useEffect(() => {
        if (!accessToken) return;
        const getShop = async () => {
            const res = await sendRequest<IListOdata<Shop>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop`,
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            queryParams: {
                $filter: `ShopId eq '${shop?.Id}' ${filter} ${search}`,
                $top: top,
                $skip: skip,
                $count: true,
                $expand: "Category",
                $orderby: orderBy == "" ? 'ShopId asc' : orderBy
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

    const handleFilter = async () => {
        setSkip(0);
        await getProducts(skip, top);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearch(`and contains(tolower(Name),'${e.target.value.toLowerCase()}')`);
    };

    return (
        <div className='h-[100vh] bg-white'>
            <button className='m-2 text-white bg-black p-2 rounded' onClick={() => { handleShowModal(true) }}>Add new product</button>
            <div className='flex items-center space-x-5 mt-5 ml-3 flex-wrap'>
                <Input
                    onChange={onChange}
                    placeholder='Search product name'
                    style={{ width: '20vw' }}
                    allowClear />
                <div className='space-x-2'>
                    <span>Status:</span>
                    <Select
                        onChange={setFilter}
                        defaultValue={""}
                        style={{ width: 120 }}
                        options={[
                            { value: "", label: "None" },
                            { value: "and IsHidden eq false", label: "Active" },
                            { value: "and IsHidden eq true", label: "Inactive" },
                        ]} />
                </div>
                <div className='space-x-2'>
                    <span>Sorted:</span>
                    <Select
                        onChange={setOrderBy}
                        defaultValue={""}
                        style={{ width: 200 }}
                        options={[
                            { value: "", label: "None" },
                            { value: "CreateAt asc", label: "Sort by the newest" },
                            { value: "CreateAt desc", label: "Sort by the oldest" },
                        ]} />
                </div>
                <button
                    onClick={async () => await handleFilter()}
                    className='bg-[#1C1B33] text-white rounded-lg py-1.5 px-2'>
                    Apply
                </button>
            </div>
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