"use client";

import { sendRequest } from "@/utils/api";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TickedUser from "../ticked-user/TickedUser";

interface CommentMusicNotificationProps {
  notification: {
    _id: string;
    recipient: string;
    sender: { _id: string; fullname: string; image: string };
    type: string;
    createdAt: string;
    friendRequestId: string;
    status: string;
    postId?: string;
    musicId?: string;
  };
  setUnreadCount: any;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const CommentMusicNotification: React.FC<CommentMusicNotificationProps> = ({
  notification,
  setUnreadCount,
  setNotifications,
}) => {
  const { accessToken } = useContext(AuthContext)!;
  const router = useRouter();
  const [status, setStatus] = useState(notification.status);
  const pathname = usePathname();

  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const markAsRead = async (id: string) => {
    if(!accessToken) return;
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications/${id}/read`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setNotifications((prev) =>
        prev.map((noti) =>
          noti._id === id ? { ...noti, status: "read" } : noti
        )
      );
      setStatus("read");

      setUnreadCount((prev: number) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  const handlePostClick = async () => {
    // setUnreadCount((prev: any) => Math.max(0, prev - 1));
    await markAsRead(notification._id!);
    router.replace(`/page/music/${notification.musicId}`);
    // if (typeof window !== "undefined" && pathname === "/page/trending") {
    //   setTimeout(() => {
    //     if (typeof window !== "undefined") {
    //       window.location.reload();
    //     }
    //   }, 300);
    // }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-[#1f1e1d] border border-zinc-700 rounded-lg shadow-sm hover:bg-[#2a2927] transition cursor-pointer">
      <div className="flex items-center" onClick={handlePostClick}>
        {/* Avatar */}
        <div className="relative mr-4 flex-shrink-0">
          <Image
            src={
              notification.sender.image ||
              "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
            }
            alt={notification.sender.fullname}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200">
            <span className="font-semibold hover:underline">
              {notification.sender.fullname}{" "}
              <TickedUser userId={notification.sender._id} />
            </span>{" "}
            <span className="text-gray-400">just comments in your music.</span>
          </p>
          <p className="text-xs text-blue-400 mt-1">{formattedTime}</p>
        </div>
      </div>

      {status === "pending" && (
        <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
      )}
    </div>

  );
};

export default CommentMusicNotification;
