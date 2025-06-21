import React from 'react';
import { Image, Space } from 'antd';
import noAvatar from "@/assets/no-avatar.png";

interface IProps {
    image: string
}
const ImageCustomize: React.FC<IProps> = ({ image }) => {
    return (
        <div
            style={{
                borderRadius: 700, // Đặt borderRadius cho container
                overflow: "hidden", // Đảm bảo nội dung bên trong không vượt ra ngoài
                display: "inline-block", // Để phù hợp với kích thước nội dung
            }}
        >
            <Space
                style={{
                    padding: 12, // Tùy chọn để thêm khoảng cách bên trong container
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                size={12}
            >
                <Image
                    style={{
                        borderRadius: 60, // Đặt ảnh tròn
                        objectFit: "cover", // Đảm bảo ảnh không bị méo
                    }}
                    height={120}
                    width={120}
                    src={image === "" ? noAvatar.src : image}
                />
            </Space>
        </div>
    );
};

export default ImageCustomize;
