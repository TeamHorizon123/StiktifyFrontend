"use client";

import { sendRequest } from "@/utils/api";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import TickedUser from "../ticked-user/TickedUser";

interface FriendRequestProps {
  notification: {
    _id: string;
    sender: { _id: string; fullname: string; image: string };
    recipient: string;
    createdAt: string;
    friendRequestId: string;
    status: string;
    type: string;
  };
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadCount: any;
}

const FriendRequest: React.FC<FriendRequestProps> = ({
  notification,
  setNotifications,
  setUnreadCount,
}) => {
  const { accessToken } = useContext(AuthContext)!;
  const [status, setStatus] = useState(notification.status);
  const router = useRouter();

  const handleAction = async (action: "accept" | "reject") => {
    if(!accessToken) return;
    try {
      const res = await sendRequest<{ statusCode: number; message: string }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/friend-requests/${notification.friendRequestId}/${action}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        method: "PATCH",
      });

      if (res.statusCode === 200) {
        // Xóa thông báo sau khi xử lý
        // setNotifications((prev) =>
        //   prev.filter((n) => n._id !== notification._id)
        // );
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id
              ? { ...n, status: action === "accept" ? "accepted" : "rejected" }
              : n
          )
        );

        // setUnreadCount((prev: any) => Math.max(0, prev - 1));

        if (action === "accept") setStatus("accepted");
        else setStatus("rejected");
      }
    } catch (error) {
      console.error("Error in send friend request:", error);
    }
  };
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const handleProfileClick = () => {
    if (status === "pending")
      setUnreadCount((prev: any) => Math.max(0, prev - 1));
    setStatus("read");
    router.push(`/page/detail_user/${notification.sender._id}`);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl shadow hover:bg-zinc-700 transition cursor-pointer">
      {/* Avatar + Icon nhỏ */}
      <div className="relative" onClick={handleProfileClick}>
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
        <p className="text-sm text-gray-200">
          <span
            onClick={handleProfileClick}
            className="font-semibold cursor-pointer hover:underline"
          >
            {notification.sender.fullname}
            <TickedUser userId={notification.sender._id} />
          </span>{" "}
          <span className="text-gray-400">
            {notification.type === "friend-request"
              ? "sent you a friend request."
              : "accepted your friend request."}
          </span>
        </p>
        <p className="text-xs text-blue-400 mt-1">{formattedTime}</p>

        {/* Nút hành động */}
        {status === "pending" &&
          notification.type !== "accept-friend-request" ? (
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("accept")}
                className="px-4 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="px-4 py-1 text-xs font-semibold text-gray-200 bg-zinc-600 rounded-md hover:bg-zinc-500 transition"
              >
                Reject
              </button>
            </div>
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          </div>
        ) : (
          <p className="text-xs font-semibold text-gray-400 mt-2">
            {status === "accepted" &&
              notification.type !== "accept-friend-request"
              ? "✅ You accepted the request."
              : notification.type !== "accept-friend-request"
                ? "❌ You rejected the request."
                : ""}
          </p>
        )}
      </div>
    </div>

  );
};

export default FriendRequest;
