"use client";
import NotificationModel from "@/components/notification/NotificationModal";
import SideBar from "@/components/page/sidebar";
import { useShowComment } from "@/context/ShowCommentContext";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { showComments } = useShowComment();

  return (
    <div className="flex">
      {!showComments && <SideBar />}
      <NotificationModel />
      <main className={`flex-grow ${!showComments ? "ml-[10%]" : ""}`}>{children}</main>
    </div>
  );
};

export default PageLayout;
