"use client";
import SideBar from "@/components/page/sidebar";
const PageLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className={`flex-grow`}>{children}</main>
    </div>
  );
};

export default PageLayout;
