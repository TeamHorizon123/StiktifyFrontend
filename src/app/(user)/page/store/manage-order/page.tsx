import { Pagination, Table } from 'antd';
import React from 'react'

const columns = [
    {
        title: 'Product name',
        dataIndex: 'name',
        Key: 'name'
    },
    {
        title: 'Product image',
        dataIndex: 'image',
        Key: 'image'
    },
    {
        title: 'User',
        dataIndex: 'user',
        Key: 'user'
    },
    {
        title: 'Address',
        dataIndex: 'address',
        Key: 'address'
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        Key: 'quantity'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        Key: 'status'
    },
        {
        title: 'Action',
        dataIndex: 'action',
        Key: 'action'
    },
];

const ManageOrder = () => {
    return (
        <div className='p-2 h-[100vh] bg-white'>
            <span className='p-2 text-3xl'>Manage order</span>
            {/* <button className='m-2 text-white bg-black p-2 rounded' onClick={() => { handleShowModal(true) }}>Add new product</button> */}
            <Table
                style={{ marginTop: 8, backgroundColor: 'transparent' }}
                columns={columns}
            // dataSource={dataSource}
            />
            <Pagination className='m-2' align="end" defaultCurrent={1} total={50} />
        </div>
    )
}

export default ManageOrder