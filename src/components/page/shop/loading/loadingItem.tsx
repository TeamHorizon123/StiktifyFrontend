import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

interface IMessage {
    notifyLoading: string
}

const LoadingItem = ({ notifyLoading }: IMessage) => {
    return (
        <div className='h-fit bg-white flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            <span>{notifyLoading}</span>
        </div>
    )
}

export default LoadingItem