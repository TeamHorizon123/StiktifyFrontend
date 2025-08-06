"use client";

import CreateRating from '@/components/page/shop/rating/createRating';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Modal } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

const RatingOrder = (id: { id: string }) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [hasRating, setHasRating] = useState<boolean>(false);
    const [order, setOrder] = useState<IOrder>();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getRating = async () => {
            const res = await sendRequest<IListOdata<IProductRating>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-rating`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `OrderId eq '${id.id}'`,
                }
            });
            setHasRating(res.value.length > 0 ? true : false);
        }

        const getOrder = async () => {
            const res = await sendRequest<IListOdata<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `Id eq '${id.id}'`,
                    $expand: "OrderItems($expand=ProductVariant,Product)"
                }
            });

            setOrder(res.value[0])
        }

        getRating();
        getOrder();
    }, []);


    return (
        <>
            {
                !hasRating && <button
                    onClick={() => setShowModal(true)}
                    className='py-1.5 px-2 bg-[#1C1B33] hover:bg-[#1c1b33a6] rounded-md'>
                    Rating
                </button>

            }
            <Modal
                title={"Rating product"}
                footer={null}
                onCancel={() => setShowModal(false)}
                destroyOnClose={true}
                visible={showModal}>
                {
                    order?.OrderItems.map((item) => (
                        <CreateRating key={item.Id} orderItem={item} orderId={order.Id} />
                    ))
                }
            </Modal>
        </>
    )
}

export default RatingOrder