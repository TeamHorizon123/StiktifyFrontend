"use client";
const PageLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex min-h-screen">
      {/* <SideBar /> */}
      <div className="w-[15rem] max-[600px]:w-[16vw]"></div>
      <main className={`flex-grow`}>{children}</main>
    </div>
  );
};

export default PageLayout;
