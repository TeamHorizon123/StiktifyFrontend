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
import { RxCross2 } from "react-icons/rx";
import { PiBellSimpleFill } from "react-icons/pi";


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
    if (!user || !accessToken) return;
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
    <div>
      <div
        className="relative w-full hover:bg-purple-500 rounded-md transition ease-in-out cursor-pointer"
        onClick={() => {
          setIsOpen(true);
          setShowNotification(true);
          setHasNewNotification(false);
        }}
      >
        <div className="flex items-center space-x-2">
          <PiBellSimpleFill className="text-xl" />
          {hasNewNotification && (
            <span className="absolute top-2 left-6 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          )}
          <p className="text-base sm:hidden max-[600px]:hidden lg:block">Notification</p>
        </div>
      </div>

      {/* Panel notification */}
      <div
        className={`fixed top-0 right-0 w-[15rem] h-full bg-[#18182c] text-white z-50 
    border-l border-r border-zinc-700 p-2 transform transition-transform duration-500 ease-in-out origin-right
    ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isOpen ? '' : 'hidden'}`}
      >


        <div className="flex items-center justify-between mt-2 mb-6 mx-2">
          <p className="text-lg font-bold">Notifications</p>
          <button
            className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600"
            onClick={() => setIsOpen(false)}
          >
            <RxCross2 />
          </button>
        </div>



        {notifications.length > 0 ? (
          <ul className="space-y-1 overflow-y-auto max-h-[80vh] pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="w-full p-2 rounded hover:bg-[#514f4b] transition cursor-pointer"
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
                  <span>Có thông báo mới</span>
                )}
              </div>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 mt-10">No Notification yet!</div>
        )}

        {hasMore && (
          <button
            className="w-full p-3 mt-4 text-center text-blue-400 hover:underline transition"
            onClick={() => setPage((prev) => prev + 1)}
          >
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationModel;
