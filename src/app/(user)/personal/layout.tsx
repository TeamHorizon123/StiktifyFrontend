import PersonalSideBar from "@/components/personal/sidebar";

const PageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex">
      <div className="w-[13%] h-screen fixed top-0 left-0">
        <PersonalSideBar />
      </div>

      <main className="flex-grow p-5 ml-64">{children}</main>
    </div>
  );
};

export default PageLayout;
