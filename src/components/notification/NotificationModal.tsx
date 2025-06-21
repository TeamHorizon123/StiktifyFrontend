"use client";

import { useState, useEffect, useContext } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import FriendRequest from "./FriendRequest";
import { useShowComment } from "@/context/ShowCommentContext";
import PostNotification from "./NewPost";
import CommentPostNotification from "./NewPostComment";
import ReactPostNotification from "./NewPostReact";
import CommentMusicNotification from "./NewMusicComment";
import FavoriteMusicNotification from "./NewMusicFavorite";
import NewMusicNotification from "./NewMusic";

interface Notification {
  _id: string;
  recipient: string;
  sender: { _id: string; fullname: string; image: string };
  type: string;
  createdAt: string;
  friendRequestId: string;
  status: string;
  postId?: string;
  musicId?: string;
}

const NotificationModel = () => {
  const { accessToken, user } = useContext(AuthContext)!;
  const { setShowNotification } = useShowComment();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isOpen) setHasNewNotification(unreadCount > 0);
  }, [unreadCount]);
  useEffect(() => {
    if (page > 1) {
      fetchNotifications();
    }
  }, [page]);
  console.log(notifications);

  const fetchNotifications = async (reset = false) => {
    try {
      const res = await sendRequest<{
        statusCode: number;
        data: { notifications: Notification[]; hasMore: boolean };
      }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications/${user._id}`,
        method: "GET",
        queryParams: { page: page, limit: 5 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.statusCode === 200) {
        if (reset) {
          setNotifications(res.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...res.data.notifications]);
        }
        setHasMore(res.data.hasMore);

        const unread = res?.data?.notifications?.some(
          (noti) => noti.status === "pending"
        );
        setUnreadCount(
          res?.data?.notifications?.reduce(
            (count, noti) => count + (noti.status === "pending" ? 1 : 0),
            0
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  useEffect(() => {
    if (!user || !accessToken) return;

    fetchNotifications(true);

    // Kết nối WebSocket
    const socket = io("http://localhost:8081", {
      transports: ["websocket", "polling"],
      auth: {
        userId: user._id,
      },
    });
    socket.emit("registerUser", user._id);

    socket.on("receiveNotification", (newNotification: Notification) => {
      if (newNotification.recipient === user._id) {
        setNotifications((prev) => [newNotification, ...prev]);
        setHasNewNotification(true);
        setUnreadCount((prev) => prev + 1);

        const audio = new Audio(
          require("@/assets/sounds/notification_sound.mp3")
        );
        audio.play().catch((err) => console.log("Lỗi phát âm thanh:", err));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, accessToken]);

  return (
    <div className="fixed top-8 right-36 z-50 ">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotification(true);
          setHasNewNotification(false);
        }}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 transition"
      >
        {hasNewNotification && unreadCount > 0 && (
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-green-300"></div>
        )}

        <Bell
          className={`w-8 h-8 text-gray-700 ${
            hasNewNotification && unreadCount > 0 ? "animate-wiggle" : ""
          }`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="z-50 absolute -right-16 w-96 mt-2 bg-white border rounded-lg shadow-lg">
          <div className="p-2 font-semibold text-gray-700 border-b">
            Notifications
          </div>

          {notifications?.length > 0 ? (
            <ul className="max-h-[75vh] overflow-y-auto">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="p-2 text-sm border-b bg-white"
                >
                  {notification.type === "friend-request" ||
                  notification.type === "accept-friend-request" ? (
                    <FriendRequest
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-video" ? (
                    <PostNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-comment" ? (
                    <CommentPostNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-react" ? (
                    <ReactPostNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-music-comment" ? (
                    <CommentMusicNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-music-favorite" ? (
                    <FavoriteMusicNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : notification.type === "new-music" ? (
                    <NewMusicNotification
                      notification={notification}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                    />
                  ) : (
                    "Có thông báo mới"
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No Notification yet!
            </div>
          )}

          {hasMore && (
            <button
              className="w-full p-2 text-center text-blue-500 hover:underline"
              onClick={() => {
                setPage((prev) => prev + 1);
                // fetchNotifications();
              }}
            >
              See More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationModel;
