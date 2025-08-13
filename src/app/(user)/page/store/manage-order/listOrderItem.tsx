"use client";

import OrderItem from '@/app/(user)/page/store/manage-order/orderItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Descriptions, DescriptionsProps, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import LoadingItem from '../../../../../components/page/shop/loading/loadingItem';

interface IData {
    id: string
}

const ListOrderItem = ({ id }: IData) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<IOrder>();

    const getOrder = async () => {
        try {
            if (!accessToken) return
            const res = await sendRequest<IListOdata<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `Id eq '${id}'`,
                    $expand: "Address,OrderItems($expand=ProductVariant)",
                }
            });
            setOrder(res.value[0] ?? null);
        } catch (error) {
            console.error("Error get order", error);
        }
    }

    useEffect(() => {
        setLoading(true);
        getOrder();
        setLoading(false);
    }, []);

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Order',
            children: order?.Id,
        },
        {
            key: '2',
            label: 'Telephone',
            children: order?.Address.PhoneReceive,
        },
        {
            key: '3',
            label: 'Receiver',
            children: order?.Address.Receiver,
        },
        {
            key: '4',
            label: 'Address',
            children: order?.Address.Address,
        },
        {
            key: '5',
            label: 'Status',
            children: order?.Status.toUpperCase(),
        },
    ];

    const handleUpdate = async () => {
        try {
            setLoading(true)
            const payload = {
                ...order,
                Status: 'shipping'
            }
            const res = await sendRequest<IBackendRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order/${order?.Id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload
            })

            if (res.statusCode == 200) message.success("Update order success.");

        } catch (error) {
            console.error("Error update status order:", error);
        } finally {
            setLoading(false);
            getOrder();
        }
    }

    if (loading)
        return (
            <div className='w-[80vw] '>
                <LoadingItem notifyLoading='' />
            </div>
        )

    return (
        <div className=' p-2 space-y-2 justify-end items-end flex flex-col'>
            <Descriptions items={items} />
            {
                order?.OrderItems.map((item) => (
                    <OrderItem key={item.Id} {...item} />
                ))
            }
            {
                order?.Status == "pending"
                && <button
                    onClick={() => handleUpdate()}
                    className='w-fit py-2 px-2.5 bg-[#1C1B33] text-white rounded-lg'>To Ship</button>
            }
        </div>
    )
}

export default ListOrderItem