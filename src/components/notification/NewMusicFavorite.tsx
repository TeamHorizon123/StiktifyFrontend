"use client";

import { sendRequest } from "@/utils/api";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TickedUser from "../ticked-user/TickedUser";

interface FavoriteMusicNotificationProps {
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

const FavoriteMusicNotification: React.FC<FavoriteMusicNotificationProps> = ({
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
    router.replace(`/page/music/${notification.musicId}`);
    // if (typeof window !== "undefined" && pathname === "/page/trending-user") {
    //   setTimeout(() => {
    //     if (typeof window !== "undefined") {
    //       window.location.reload();
    //     }
    //   }, 300);
    // }
  };

  return (
    <div className="flex flex-row justify-between items-center gap-3 p-3 bg-white border rounded-md shadow-sm cursor-pointer">
      <div className="flex items-start" onClick={handlePostClick}>
        {/* Avatar */}
        <div className="relative mr-3">
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
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-bold">
              {notification.sender.fullname}{" "}
              <TickedUser userId={notification.sender._id} />
            </span>{" "}
            <span className="text-gray-600">just likes in your music.</span>
          </p>
          <p className="text-xs text-blue-500 mt-1">{formattedTime}</p>
        </div>
      </div>
      {status === "pending" && (
        <span className=" w-3 h-3 bg-blue-500 rounded-full"></span>
      )}
    </div>
  );
};

export default FavoriteMusicNotification;
