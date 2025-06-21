import DashboardContent from '@/components/layout/content.dashboard';
import DashboardFooter from '@/components/layout/footer.dashboard';
import DashboardHeader from '@/components/layout/header.dashboard';
import DashboardSideBar from '@/components/layout/sidebar.dashboard';
import { DashboardContextProvider } from '@/library/dashboard.context';

const DashboardLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <DashboardContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <DashboardSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <DashboardHeader />
                    <DashboardContent>
                        {children}
                    </DashboardContent>
                    <DashboardFooter />
                </div>
            </div>
        </DashboardContextProvider>
    )
}

export default DashboardLayout