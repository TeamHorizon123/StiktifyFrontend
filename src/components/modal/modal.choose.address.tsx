"use client";

import React, { useState } from 'react'
import { List } from 'antd';

interface IData {
    listAddress: IUserAddress[],
    default: string,
    onClose: () => void,
    setChooseAddress: (id: IUserAddress) => void
}

const ModalChooseAddress = (data: IData) => {
    const [choose, setChoose] = useState<IUserAddress | undefined>(data.listAddress.find(a => a.Id === data.default));

    const handleConfirm = () => {
        data.setChooseAddress(choose!);
        data.onClose();
    }

    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={data.listAddress}
                renderItem={(item) => (
                    <List.Item
                        key={item.Id}
                        actions={[
                            choose && choose.Id !== item.Id ? <button onClick={() => setChoose(item)} key={item.Id}>Choose</button>
                                :
                                <span className='p-1 text-red-500 border border-red-500 rounded-sm'>Current</span>
                        ]}
                    >
                        <List.Item.Meta
                            title={<p>{item.Receiver}</p>}
                            description={<>
                                <p>{item.PhoneReceive}</p>
                                <p>{item.Address}</p>
                            </>}
                        />
                        {
                            choose && choose.Id === item.Id && <span className='text-red-500'>Selected</span>
                        }
                    </List.Item>
                )}
            />
            <div className='flex items-center justify-end space-x-3'>
                <button onClick={() => {
                    data.onClose()
                }} className='py-1.5 px-2.5 border rounded'>Cancel</button>
                <button
                    onClick={() => handleConfirm()}
                    className='py-1.5 px-2.5 border rounded bg-sky-800 text-white'>Confirm</button>
            </div>

        </div>
    )
}

export default ModalChooseAddress