'use client'
import { Layout } from 'antd';

const DashboardFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Stiktify ©{new Date().getFullYear()} Created by @Group 3
            </Footer>
        </>
    )
}

export default DashboardFooter;