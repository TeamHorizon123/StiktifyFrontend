"use client";

import { sendRequest } from "@/utils/api";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TickedUser from "../ticked-user/TickedUser";

interface CommentPostNotificationProps {
  notification: {
    _id: string;
    recipient: string;
    sender: { _id: string; fullname: string; image: string };
    type: string;
    createdAt: string;
    friendRequestId: string;
    status: string;
    postId?: string;
  };
  setUnreadCount: any;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const CommentPostNotification: React.FC<CommentPostNotificationProps> = ({
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
    router.replace(`/page/trending?id=${notification.postId}`);
    if (typeof window !== "undefined" && pathname === "/page/trending") {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 300);
    }
  };

  return (
    <div
      onClick={handlePostClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition cursor-pointer"
    >
      {/* Avatar */}
      <Image
        src={
          notification.sender.image ||
          "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
        }
        alt={notification.sender.fullname}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      {/* Nội dung */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-200">
          <span className="font-semibold">
            {notification.sender.fullname}
            <TickedUser userId={notification.sender._id} />
          </span>{" "}
          <span className="text-gray-400">commented on your post.</span>
        </p>
        <p className="text-xs text-blue-400 mt-1">{formattedTime}</p>
      </div>

      {/* Dot unread */}
      {status === "pending" && (
        <span className="ml-auto w-3 h-3 bg-blue-500 rounded-full"></span>
      )}
    </div>
  );
};

export default CommentPostNotification;
