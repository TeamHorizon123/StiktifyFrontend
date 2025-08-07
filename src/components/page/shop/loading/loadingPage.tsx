import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

interface IMessage {
    notifyLoading: string
}

const LoadingPage = ({ notifyLoading }: IMessage) => {
    return (
        <div className='h-[100vh] main-layout flex flex-col items-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />} />
            <span className='text-white'>{notifyLoading}</span>
        </div>
    )
}

export default LoadingPage
