"use client";

import ModalAddAddress from '@/components/modal/modal.add.address';
import ModalUpdateAddress from '@/components/modal/modal.update.address';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { PlusOutlined } from '@ant-design/icons';
import { List, message, Modal, Skeleton } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

const AddressPage = () => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [loading, setLoading] = useState(true);
    // const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState<IUserAddress[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [address, setAddress] = useState<string>("");
    const [updateData, setUpdateData] = useState<IUserAddress | null>(null);

    const getAddress = async () => {
        try {
            setLoading(true);
            const res = await sendRequest<IListOdata<IUserAddress>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/user-address`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `UserId eq '${user?._id}'`,
                    $top: 8,
                    $skip: 0,
                    $count: true
                }
            });
            // setTotal(res['@odata.count'] ?? 0)
            setAddresses(res.value ?? []);
        } catch {
            message.error("Undefine error.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAddress();
    }, [accessToken, user, showModal, showUpdate]);

    const handleDelete = async () => {
        try {
            await sendRequest<IBackendRes<IUserAddress>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/user-address/${address}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
        } catch {
        }
        finally {
            setShowConfirm(false);
            getAddress();
        }
    }

    return (
        <div className='p-4 text-white'>
            <List
                header={
                    <>
                        <div className='text-white bg-[#1C1B33] p-2 rounded flex items-center justify-between'>
                            <p className='text-base font-medium'>My address</p>
                            <button
                                className='p-2 flex items-center space-x-2 rounded-md bg-[#454B79] hover:bg-[#555d95]'
                                onClick={() => setShowModal(true)}>
                                <PlusOutlined />
                                <span>Add new address</span>
                            </button>
                        </div>
                    </>
                }
                loading={loading}
                dataSource={addresses}
                itemLayout='horizontal'
                renderItem={(item) => (
                    <List.Item
                        className='bg-[#454B79] rounded-lg my-1'
                        actions={[
                            <button onClick={() => {
                                setUpdateData(item)
                                setShowUpdate(true)
                            }}
                                className='text-white hover:underline' key={item.Id}>Edit</button>,
                            <button className='text-white hover:underline' key={item.Id}
                                onClick={() => {
                                    setAddress(item.Id)
                                    setShowConfirm(true)
                                }}>Delete</button>
                        ]}>
                        <Skeleton avatar title={false} loading={loading} active>
                            <List.Item.Meta
                                title={<p className='text-white text-lg px-4'>{item.Receiver}</p>}
                                description={<p className='text-white font-light px-4'>Phone number: {item.PhoneReceive}</p>}
                            />
                            <p className='text-white'>{item.Address}</p>
                        </Skeleton>
                    </List.Item>
                )} />

            <Modal
                open={showModal}
                footer
                destroyOnClose
                onCancel={() => setShowModal(false)}
                title="New address (use information after merged)">
                <ModalAddAddress showModal={() => setShowModal(false)} />
            </Modal>
            <Modal
                open={showUpdate}
                footer
                destroyOnClose
                onCancel={() => setShowUpdate(false)}
                title="Update address (use information after merged)">
                <ModalUpdateAddress address={updateData!} showModal={() => setShowUpdate(false)} />
            </Modal>
            <Modal
                open={showConfirm}
                footer
                destroyOnClose
                centered
                onCancel={() => setShowConfirm(false)}
                title="Confirm delete address">
                <p>Are you sure to delete this address?</p>
                <div className='flex items-center justify-end space-x-2'>
                    <button onClick={() => setShowConfirm(false)} className='px-3 py-1 rounded border hover:bg-slate-200'>Cancel</button>
                    <button onClick={() => handleDelete()} className='px-3 py-1 rounded border text-white bg-red-500 border-red-500 hover:bg-red-600'>Delete</button>
                </div>
            </Modal>
        </div>
    )
}

export default AddressPage