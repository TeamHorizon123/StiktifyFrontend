"use client";
import SideBar from "@/components/page/sidebar";
// import { useShowComment } from "@/context/ShowCommentContext";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  // const { showComments } = useShowComment();

  return (
    <div className="flex flex-wrap content-start">
      {/* {!showComments && <SideBar />} */}
      <SideBar />
      <main className="grow ml-[15rem]">{children}</main>
    </div>
  );
};

export default PageLayout;
