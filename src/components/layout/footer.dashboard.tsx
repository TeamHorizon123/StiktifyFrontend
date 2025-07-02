'use client'
import { Layout } from 'antd';

const DashboardFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Stiktify ©{new Date().getFullYear()} Created by @Horizon
            </Footer>
        </>
    )
}

export default DashboardFooter;