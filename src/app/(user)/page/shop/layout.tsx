"use client";
const PageLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex min-h-screen">
      <div className="w-[15rem] max-[600px]:w-[16vw] shrink-0"></div>
      <main className={`flex-grow`}>{children}</main>
    </div>
  );
};

export default PageLayout;
