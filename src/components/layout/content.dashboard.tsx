'use client'

import { Content } from "antd/es/layout/layout";

const DashboardContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <Content>
            <div
                style={{
                    padding: 24,
                    minHeight: 'calc(100vh - 180px)',
                    // background: "#ccc",
                    // borderRadius: "#ccc",
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default DashboardContent;