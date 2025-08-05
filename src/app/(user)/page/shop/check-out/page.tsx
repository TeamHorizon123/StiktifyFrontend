"use client";

import ModalAddAddress from '@/components/modal/modal.add.address';
import ModalChooseAddress from '@/components/modal/modal.choose.address';
import CheckoutProduct from '@/components/page/shop/checkout/checkout.product';
import { AuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { sendRequest } from '@/utils/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Checkbox, List, Modal, Result, Spin } from 'antd';
import { MdOutlinePayment } from "react-icons/md";
import React, { useContext, useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import Link from 'next/link';
import { formatCurrencyVND } from '../../../../../utils/utils';
import { useRouter } from 'next/navigation';
import ListProduct from '@/app/(user)/page/shop/listProduct';

interface VnPay {
    url: string
}

const CheckoutPage = () => {
    const { selectedItems, setSelectedItems } = useCart();
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    // const [orders, setOrders] = useState<IOrder[]>([]);
    const [methods, setMethods] = useState<IPaymentMethod[]>();
    const [chooseMethod, setChooseMethod] = useState<IPaymentMethod | null>();
    const [showAddresses, setShowAddresses] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [addresses, setAddresses] = useState<IUserAddress[]>([]);
    const [chooseAddress, setChooseAddress] = useState<IUserAddress | undefined>(undefined);
    const [groupOrder, setGroupOrder] = useState<Record<string, ICart[]>>({});
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const getAddress = async () => {
        const res = await sendRequest<IListOdata<IUserAddress>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/user-address`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            queryParams: {
                $filter: `UserId eq '${user?._id}'`
            }
        })

        setAddresses(res.value ?? []);
        setChooseAddress(res.value[0] ?? undefined);
        groupByShop(selectedItems);
    }

    const groupByShop = (cartItems: ICart[]) => {
        // console.log(cartItems);
        let sum = 0;

        const group: Record<string, ICart[]> = {};
        cartItems.forEach((item) => {
            if (!group[item.Product.ShopId]) {
                group[item.Product.ShopId] = [];
            }
            group[item.Product.ShopId].push(item);
            sum += item.Quantity * (item.Variant.Price ?? item.Option.Price ?? item.Product.Price)
            setTotal(sum);
        });

        setGroupOrder(group);
    }

    const handlePlaceOrder = async () => {
        try {
            const promises = Object.entries(groupOrder).map(async ([shopId, items]) => {

                const cartIdsToDelete = items
                    .filter(item => !!item.Id)
                    .map(item => ({ Id: item.Id }));

                const orderItems = items.map(item => ({
                    ProductId: item.Product.Id,
                    ProductVariantId: item.Variant?.Id,
                    Quantity: item.Quantity,
                    UnitPrice: item.Variant?.Price ?? item.Option?.Price ?? item.Product.Price,
                    ImageUri: item.ImageUri
                }));

                const payload = {
                    UserId: user._id,
                    ShopId: shopId,
                    AddressId: chooseAddress?.Id,
                    Status: "pending",
                    ShippingFee: 0,
                    PaymentMethodId: chooseMethod,
                    OrderItems: orderItems,
                };

                const orderRes = await sendRequest<ICreateResponse>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: payload
                });

                if (orderRes.id && cartIdsToDelete.length > 0) {
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/cart/delete-many`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(cartIdsToDelete)
                    })
                }

                if (chooseMethod?.Name === "E-wallet") {
                    const res = await sendRequest<IListOdata<IOrder>>({
                        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/order`,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        queryParams: {
                            $filter: `Id eq '${orderRes.id}'`
                        }
                    });
                    const clientIp = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip)
                    const vnpayRes = await sendRequest<VnPay>({
                        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/payment/create-vnpay`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: {
                            Amount: res.value[0].Total,
                            OrderId: res.value[0].Id,
                            OrderInfo: `Purchase-order-code-${res.value[0].Id}`,
                            IpAddress: clientIp
                        }
                    })
                    if (vnpayRes.url) window.location.href = vnpayRes.url;
                }
            });

            await Promise.all(promises);
            if (chooseMethod?.Name != 'E-wallet')
                setSuccess(true);
            setSelectedItems([]);
            // console.log("Order success: ", success);

        } catch (error) {
            console.error("Order placement failed:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (selectedItems.length < 1)
            router.push('/page/shop/cart');
        if (user) {
            getAddress();
        }

        const getPaymentMethod = async () => {
            const res = await sendRequest<IListOdata<IPaymentMethod>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/payment-method`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: "Enable eq true"
                }
            });

            setMethods(res.value ?? []);
            setChooseMethod(res.value.length > 0 ? res.value[0] : null)
        }
        getPaymentMethod();
        setLoading(false);
    }, [accessToken, user]);

    if (loading)
        return (
            <div className="w-full h-[80vh] text-white flex flex-col items-center justify-center space-y-4">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 64, color: 'white' }} spin />} />
                <span className="font-bold uppercase">Loading...</span>
            </div>
        )

    if (success)
        return (<>
            <Result
                status="success"
                title={<p className='text-white'>Successfully order</p>}
                extra={
                    <Link
                        href={'/page/shop'}
                        className='py-2.5 px-4 bg-[#1C1B33] rounded-full hover:scale-110 text-white' >
                        Go Shop
                    </Link>
                }
            />
            <ListProduct />
        </>)

    return (
        <div className='text-white p-2 sm:w-full md:w-[80vw] m-auto space-y-2'>
            {/* List Address */}
            <div className='text-base'>
                <div className='p-4 flex space-x-2 items-center bg-[#1C1B33] rounded-tl-lg rounded-tr-lg'>
                    <FaLocationDot />
                    <p>Receiving address</p>
                </div>
                <div className='p-4 bg-[#454B79] flex space-x-4 items-center rounded-bl-sm rounded-br-sm'>
                    <div className='flex space-x-2 items-center'>
                        <p>{chooseAddress?.Receiver ?? "Name"}</p>
                        <p>(+84) {chooseAddress?.PhoneReceive.substring(1) ?? "000000000"}</p>
                    </div>
                    <p className='font-extralight'>{chooseAddress?.Address ?? "Address"}</p>
                    <button
                        onClick={() => setShowAddresses(true)}
                        className='ml-2 rounded border p-2 hover:bg-slate-600'>Choose other</button>
                </div>
                <div
                    className="w-full h-0.5"
                    style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, #009dff 0 10px, transparent 10px 20px, #fb1500 20px 30px, transparent 30px 40px)`
                    }}
                ></div>
            </div>
            {/* list product item */}
            <div className='p-2 bg-[#454B79] rounded-md space-y-3'>

                {
                    Object.entries(groupOrder).map(([shopId, items]) => (
                        <>
                            <CheckoutProduct key={shopId} shopId={shopId} items={items} />
                        </>
                    ))
                }

            </div>
            {/* Payment method */}
            <div className='p-2 bg-[#454B79] rounded-md space-y-3'>
                <List
                    size="large"
                    header={<div className='flex items-center text-lg text-white space-x-2'>
                        <MdOutlinePayment />
                        <span>Payment method</span>
                    </div>}
                    dataSource={methods}
                    // dataSource={methods}
                    renderItem={(item) =>
                        <List.Item
                            key={item.Id}
                            actions={[

                            ]}>
                            <div className='text-white flex justify-between items-center w-full'>
                                <p>{item.Name ?? "COD"}</p>
                                <Checkbox
                                    checked={item.Id === chooseMethod?.Id}
                                    onClick={() => {
                                        setChooseMethod(item.Id === chooseMethod?.Id ? null : item)
                                    }} key={item.Id} />
                            </div>
                        </List.Item>}
                />
            </div>

            {/* Summary order */}
            <div className='p-2 bg-[#454B79] rounded-md space-y-3 flex flex-col items-end'>
                <div className='w-80 space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p>Merchandise Subtotal</p>
                        <p>{formatCurrencyVND(total)}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p>Shipping Subtotal</p>
                        <p>0</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p>Total Payment:</p>
                        <p className=' font-bold text-[#EF4444] text-2xl'>{formatCurrencyVND(total)}</p>
                    </div>
                </div>
                <div className='p-4 w-full flex justify-between items-center'>
                    <p className='font-extralight text-sm'>{"By clicking 'Place Order', you are agreeing to Stiktify's "}
                        <Link className='font-bold' href={''}>General Transaction Terms</Link>
                    </p>
                    {
                        chooseMethod?.Name === "Cash On Delivery (COD)" &&
                        <button onClick={async () => await handlePlaceOrder()} className='py-2.5 px-4 bg-[#1C1B33] rounded-full hover:scale-110'>Place order</button>
                    }
                    {
                        chooseMethod?.Name === "E-wallet" &&
                        <button onClick={async () => await handlePlaceOrder()} className='py-2.5 px-4 bg-[#1C1B33] rounded-full hover:scale-110'>Place order with VNPay</button>
                    }
                </div>
            </div>

            <Modal
                open={showAddresses}
                footer
                destroyOnClose
                onCancel={() => setShowAddresses(false)}
                title="My Address">
                <ModalChooseAddress
                    default={chooseAddress?.Id ?? ""}
                    listAddress={addresses}
                    onClose={() => setShowAddresses(false)}
                    setChooseAddress={() => setChooseAddress} />
            </Modal>
            <Modal
                open={showModal}
                footer
                destroyOnClose
                onCancel={() => setShowModal(false)}
                title="New address (use information after merged)">
                <ModalAddAddress showModal={() => setShowModal(false)} />
            </Modal>
        </div>
    )
}

export default CheckoutPage