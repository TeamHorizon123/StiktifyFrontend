import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { formatDateTimeVn } from '@/utils/utils';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    data: IDataReport[]
}

const ModalListReport = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, data } = props;

    const [size, setSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth / 1.5 : 0,
        height: typeof window !== "undefined" ? window.innerHeight / 1.3 : 0
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setSize({
            width: window.innerWidth / 1.5,
            height: window.innerHeight / 1.3
        });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleCancel = () => setIsModalOpen(false);

    const columns = [
        {
            title: 'Report By',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Reason',
            dataIndex: 'reasons',
            key: 'reasons',
        },
        {
            title: 'Report Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatDateTimeVn(text),
        },
    ];

    return (
        <Modal
            style={{ top: "10%" }}
            width={size.width}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={false}
            closable={false}
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record._id}
                pagination={false}
                scroll={{ y: size.height - 150 }}
            />
        </Modal>
    );
};

export default ModalListReport;
