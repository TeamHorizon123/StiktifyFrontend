import React, { useEffect, useRef, useState } from 'react';
import { Card, Modal } from 'antd';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    data: IDataReport[]
}
const ModalListReport = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, data } = props


    const [size, setSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth / 1.5 : 0,
        height: typeof window !== "undefined" ? window.innerHeight / 1.3 : 0
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setSize({ width: window.innerWidth / 1.5, height: window.innerHeight / 1.3 });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            <Modal
                style={{ top: "10%", overflow: "auto" }}
                width={size.width}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                // styles={{
                //     content: { marginTop: 0, top: 0, padding: 5, paddingBottom: 1, backgroundColor: "#1e272e" },
                //     body: { overflow: "hidden", }
                // }}
                footer={false}
                closable={false}
            >
                <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                    {data && data.length > 0 && data.map((item, index) => (
                        <Card
                            key={item._id + index}
                            title={item.userName}
                            bordered={false}
                            style={{ width: 300, border: "1px solid #dfe6e9" }}>
                            <p>{item.reasons}</p>
                        </Card>
                    ))}
                </div>
            </Modal >

        </>
    );
};

export default ModalListReport;