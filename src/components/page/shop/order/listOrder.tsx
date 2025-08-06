"use client";

import OrderItem from '@/components/page/shop/order/orderItem';
import RatingOrder from '@/components/page/shop/order/ratingOrder';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { List, message, notification, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { FaStore } from "react-icons/fa6";

const ListOrder = (orderType: { orderType: string }) => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [newOrders, setNewOrders] = useState<IOrder[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const [totalItem, setTotalItem] = useState(0);
    const [remain, setRemain] = useState(0);

    const getOrders = async (page: number) => {
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
                    $filter: `UserId eq '${user?._id}' ${orderType.orderType == 'all' ? "" : `and Status eq '${orderType.orderType}'`}`,
                    $top: 4,
                    $skip: page * 4,
                    $orderby: "CreateAt asc",
                    $expand: "Shop,OrderItems($expand=ProductVariant,Product)"
                }
            });

            setOrders((prev) => [...prev, ...res.value]);
            setNewOrders(res.value);
            setTotalItem(res['@odata.count'] ?? 0);
        } catch (error) {
            console.log('error fetch data', error);
        }
    }

    useEffect(() => {
        setRemain(totalItem - page * 4);
    }, [totalItem, page]);

    useEffect(() => {
        setHasMore(!(remain < 4));
    }, [remain])

    useEffect(() => {
        setOrders([]);
        setPage(0);
        getOrders(0);
        setHasMore(true);
    }, [orderType])

    const loadMoreOrders = async () => {
        setLoading(true);
        setPage((prev) => prev + 1);
        await getOrders(page);
        if (newOrders.length < 4) setHasMore(false);
        setLoading(false);
    };

    const handleBuyAgain = () => {
        message.info("This feature will be updated soon!");
    }

    const handleCancelOrder = async (data: IOrder) => {
        const payload = {
            Id: data.Id,
            UserId: data.UserId,
            ShopId: data.ShopId,
            AddressId: data.AddressId,
            Status: 'cancelled',
            TotalAmount: data.Total,
            ShippingFee: data.ShippingFee,
            OrderItems: data.OrderItems
        }

        try {
            const res = await sendRequest<IOdataRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order/${data.Id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload
            })
            if (res.statusCode == 200) {
                openNotification('info', 'Cancel order success!');
                message.success('Cancel order success!');
                setOrders([]);
                getOrders(0);
            }
        } catch (error) {
            console.error("Error update order", error);
            openNotification('error', "Cancel order failure.")
            message.error('Cancel order failure!');
        }
    }

    const openNotification = (type: 'success' | 'error' | 'info', message: string) => () => {
        api[type]({
            message: 'Notification',
            description: message,
            duration: 3
        });
    };

    const updateInStock = async (data: IOrderItem) => {
        const payload = {
            ...data.ProductVariant,
            Quantity: data.ProductVariant.Quantity! - data.Quantity
        }
        // console.log(payload);
        await sendRequest<IOdataRes<IProductOption>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-variant/${data.ProductVariantId}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: payload
        })
    }

    const handleReceivedOrder = async (order: IOrder) => {
        try {
            setLoading(true)
            order?.OrderItems.map((item) => {
                updateInStock(item);
            })
            const payload = {
                ...order,
                Status: 'completed'
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
            getOrders(0);
        }
    }

    return (
        <div className='w-[80vw]'>
            {contextHolder}
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item >
                        <div className='p-4 text-white bg-[#454B79] rounded '>
                            <div className='flex items-center justify-between pb-3 border-b'>
                                <div className='flex items-center space-x-2'>
                                    <FaStore />
                                    <b>{order.Shop.ShopName}</b>
                                </div>
                                <p className='font-bold uppercase'>{order.Status}</p>
                            </div>

                            <div className='flex justify-between items-end'>
                                <div>
                                    {
                                        order.OrderItems.map((item) => (
                                            <OrderItem key={item.Id} {...item} />
                                        ))
                                    }
                                </div>
                                {
                                    order.Status == "completed" &&
                                    <div className='space-x-1'>
                                        <button
                                            onClick={() => handleBuyAgain()}
                                            className='py-1.5 px-2 bg-[#1C1B33] hover:bg-[#1c1b33a6] rounded-md'>
                                            Buy again
                                        </button>
                                        <RatingOrder id={order.Id} />
                                    </div>
                                }

                                {
                                    order.Status == "pending" &&
                                    <button
                                        onClick={async () => await handleCancelOrder(order)}
                                        className='py-1.5 px-2 bg-[#1C1B33] hover:bg-[#1c1b33a6] rounded-md'>
                                        Cancel order
                                    </button>
                                }

                                {
                                    order.Status == "shipping" &&
                                    <button
                                        onClick={async () => await handleReceivedOrder(order)}
                                        className='py-1.5 px-2 bg-[#1C1B33] hover:bg-[#1c1b33a6] rounded-md'>
                                        Confirmed received
                                    </button>
                                }

                            </div>

                        </div>
                    </List.Item>
                )}
                loadMore={
                    hasMore ? (
                        <div style={{ textAlign: "center", marginTop: 12 }}>
                            {loading ? (
                                <Spin />
                            ) : (
                                <button
                                    className='text-white bg-[#1C1B33] hover:bg-[#1c1b33a6] p-2 px-4 rounded'
                                    onClick={async () => await loadMoreOrders()}>Load more</button>
                            )}
                        </div>
                    ) : (<></>
                    )
                }
            />
        </div>

    );
}

export default ListOrder