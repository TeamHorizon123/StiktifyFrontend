"use client";

import ListOrderItem from '@/app/(user)/page/store/manage-order/listOrderItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Modal, Select, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

const ManageOrder = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [skip, setSkip] = useState(0);
    const [top] = useState(8);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [defaultCurrent, setDefaultCurrent] = useState(1);
    const [dataSource, setDataSource] = useState<object[]>([]);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [shop, setShop] = useState<Shop | null>(null);
    const [orderBy, setOrderBy] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [order, setOrder] = useState<string>("");

    const columns = [
        {
            title: 'Order',
            dataIndex: 'id',
            Key: 'id',
            render: (_: any, record: any) => (
                <span>
                    {record.id}
                </span>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            Key: 'address'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            Key: 'status',
            render: (status: string) => (
                <>
                    {
                        status == "pending" && <Tag>{status}</Tag>
                    }{
                        status == "completed" && <Tag color='success'>{status}</Tag>
                    }{
                        status == "cancelled" && <Tag color='error'>{status}</Tag>
                    }{
                        status == "shipping" && <Tag color='processing'>{status}</Tag>
                    }
                </>
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            Key: 'action',
            render: (id: string) => (
                <a onClick={() => {
                    setShowModal(true)
                    setOrder(id)
                    console.log(id);
                }} className='text-[#1C1B33] hover:text-[#1C1B33] hover:underline'>View</a>
            ),
        },
    ];

    const getOrders = async (skip: number, top: number) => {
        try {
            if (!accessToken) return
            const res = await sendRequest<IListOdata<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $count: true,
                    $filter: `ShopId eq '${shop?.Id}' ${filter}`,
                    $expand: "Address,OrderItems",
                    $top: top,
                    $skip: skip,
                    $orderby: orderBy == "" ? 'ShopId asc' : orderBy
                }
            });
            setTotal(res['@odata.count'] ?? 0);
            setOrders(res.value ?? []);

        } catch (error) {
            console.log('error fetch data', error);
        }
    }

    useEffect(() => {
        const getShop = async () => {
            try {
                if (!accessToken) return
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
                setShop(res.value[0] ?? null);

            } catch (error) {
                console.log('error fetch data', error);
            }
        }

        getShop();
    }, []);

    useEffect(() => {
        setLoading(true);
        getOrders(skip, top);
        setLoading(false);
    }, [accessToken, user, shop, showModal])

    useEffect(() => {

        const updateData = () => {
            const data = orders.map((order) => (
                {
                    key: order?.Id,
                    id: order.Id,
                    address: order.Address.Address,
                    status: order.Status,
                    action: order.Id
                }
            ))
            setDataSource(data);
            setDefaultCurrent(1);
        }

        updateData();
    }, [orders]);

    const handleFilter = async () => {
        setSkip(0);
        await getOrders(skip, top);
    }


    return (
        <div className='p-2 h-[100vh] bg-white'>
            <span className='p-2 text-3xl'>Manage order</span>
            {/* <button className='m-2 text-white bg-black p-2 rounded' onClick={() => { handleShowModal(true) }}>Add new product</button> */}
            <div className='flex items-center space-x-5 mt-5 ml-3 flex-wrap'>
                <div className='space-x-2'>
                    <span>Status:</span>
                    <Select
                        onChange={setFilter}
                        defaultValue={""}
                        style={{ width: 120 }}
                        options={[
                            { value: "", label: "None" },
                            { value: "and Status eq 'pending'", label: "Pending" },
                            { value: "and Status eq 'shipping'", label: "Shipping" },
                            { value: "and Status eq 'completed'", label: "Completed" },
                            { value: "and Status eq 'cancelled'", label: "Cancelled" },
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
                loading={loading}
                style={{ marginTop: 8, backgroundColor: 'transparent' }}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    current: skip / top + 1,
                    total: total,
                    pageSize: top,
                    showSizeChanger: false,
                    defaultCurrent: defaultCurrent,
                    onChange: async (page, pageSize) => {
                        const newSkip = (page - 1) * pageSize;
                        setSkip(newSkip);
                        await getOrders(newSkip, top);
                    },
                }}
            />

            <Modal
                title={"Order information"}
                footer={null}
                centered
                onCancel={() => setShowModal(false)}
                destroyOnClose={true}
                visible={showModal}>
                <ListOrderItem id={order} />
            </Modal>
        </div>
    )
}

export default ManageOrder