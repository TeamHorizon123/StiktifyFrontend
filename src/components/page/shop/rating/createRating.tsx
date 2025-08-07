"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { Form, Rate } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useContext, useEffect, useState } from 'react'

interface IData {
    orderItem: IOrderItem,
    orderId: string
}

const CreateRating = ({ orderItem, orderId }: IData) => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [form] = Form.useForm();
    const [point, setPoint] = useState(3);
    const [showBtn, setShowBtn] = useState(true);

    const handleRating = async () => {
        const formData = form.getFieldsValue();
        const payload = {
            ProductId: orderItem.ProductId,
            OptionId: orderItem.ProductVariant.ProductOptionId,
            VariantId: orderItem.ProductVariantId,
            OrderId: orderId,
            UserId: user?._id,
            Point: point,
            Content: formData.Content
        }
        try {
            const res = await sendRequest<ICreateResponse>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-rating`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload
            })

            if (res.id) setShowBtn(false);
        } catch (error) {
            console.error("Error rating product", error);
        }
    }

    useEffect(() => {
        const getRating = async () => {
            const res = await sendRequest<IListOdata<IProductRating>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-rating`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `OrderId eq '${orderId}' and ProductId eq '${orderItem.ProductId}' and VariantId eq ${orderItem.ProductVariantId}`,
                }
            })

            if (res.value) setShowBtn(false);
        }
        getRating();
    }, [])

    return (
        <Form
            layout='horizontal'
            form={form}
            // labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 800, display: 'flex', flexDirection: 'column' }}
            clearOnDestroy={true}
        >
            <div>
                <img className='w-24 h-24 bg-white rounded' src={orderItem.ImageURI} alt="item image" />
                <Form.Item rules={[{ required: true }]}>
                    <Rate defaultValue={point} onChange={setPoint} />
                </Form.Item>
                <Form.Item name={"Content"} rules={[{ required: true, message: "Content is required" }]}>
                    <TextArea rows={4} maxLength={150} showCount
                        placeholder='Enter your option about the product.' />
                </Form.Item>
            </div>{
                showBtn &&
                <button
                    onClick={handleRating}
                    className='items-end border border-black hover:border-black py-2 rounded-lg hover:bg-slate-200' >
                    Rating
                </button>}
        </Form>
    )
}

export default CreateRating