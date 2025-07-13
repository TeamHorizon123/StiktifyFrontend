"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaUser } from "react-icons/fa";
import {
  FiCalendar,
  FiEdit,
  FiMapPin,
  FiShare2,
  FiShoppingBag,
  FiUserPlus,
  FiUserX,
} from "react-icons/fi";
import { LuBellRing } from "react-icons/lu";
import MyVideo from "@/components/page/myvideo/MyVideo";
import LikedVideo from "@/components/page/likedVideoPost/LikedVideo";
import ListFavoriteMusic from "@/components/music/music-favorite/list.favorite";
import ListMyMusic from "@/components/page/mymusic/list-my-music";
import FollowerModal from "@/components/modal/modal.follower";
import FollowingModal from "@/components/modal/modal.following";
import {
  checkFollowAction,
  handleFollow,
} from "@/actions/manage.follow.action";
import { Heart, Video, Music } from "lucide-react";
import { notification } from "antd";

interface IUserDetail {
  _id: string;
  image: string;
  fullname: string;
  email: string;
  isActive: boolean;
  bio: string;
  address: string;
  createdAt: string;
  totalFollowers: number;
  totalFollowings: number;
  totalViews: number;
  totalLikes: number;
  isShop: boolean;
}

const UserDetail = () => {
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [userData, setUserData] = useState<IUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "video" | "music" | "likedVideo" | "likedMusic"
  >("video");
  const isCurrent = user?._id === id;
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollow, setFollow] = useState(false);

  useEffect(() => {
    if (!id || !accessToken) return;
    (async () => {
      const res = await checkFollowAction(user?._id, id + "");
      if (res?.statusCode === 201) {
        setFollow(res?.data);
      } else {
        setFollow(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchUserDetail();
    checkFriend();
  }, [id, accessToken]);

  const fetchUserDetail = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data) {
        setUserData(res.data);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!accessToken) {
      console.error("User not authenticated");
      return;
    }
    try {
      const res = await sendRequest({
        url: "http://localhost:8080/api/v1/friend-requests",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: { receiverId: id, senderId: user._id },
      });

      if (res) {
        setFriendRequestSent(true);
        console.log("Friend request sent successfully");
      }
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  const checkFriend = async () => {
    if (!accessToken) {
      console.error("User not authenticated");
      return;
    }
    try {
      const res = await sendRequest<any>({
        url: `http://localhost:8080/api/v1/friend-requests/check-friendship/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.isFriend) {
        setIsFriend(true);
      }
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  const unfriend = async () => {
    if (!accessToken) {
      console.error("User not authenticated");
      return;
    }
    try {
      const res = await sendRequest<any>({
        url: `http://localhost:8080/api/v1/friend-requests/unfriend/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.isFriend) {
        setIsFriend(false);
        setFriendRequestSent(false);
      }
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  const handleFollowClick = async () => {
    if (!user || !accessToken) return;
    try {
      await handleFollow(user._id, id as string);
      setFollow((prev) => !prev); // Đảo trạng thái follow
    } catch (error) {
      notification.error({ message: "Follow action failed" });
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userData)
    return <p className="text-center text-gray-600">No user data</p>;

  const tabConfig = {
    video: { label: "Video", icon: <Video size={18} /> },
    music: { label: "Music", icon: <Music size={18} /> },
    likedVideo: { label: "Liked Video", icon: <Heart size={18} /> },
    likedMusic: { label: "Liked Music", icon: <Heart size={18} /> },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-0 py-0 main-layout">
      <div className="w-full max-w-6xl mx-auto pt-10 pb-16">
        {/* Profile Header */}
        <div className="relative flex flex-col items-center md:flex-row md:items-end gap-6 px-6 pb-8">
          <div className="relative">
            {userData?.image ? (
              <img
                src={userData.image}
                className="w-28 h-28 rounded-full object-cover"
                alt="Profile"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-purple-900 flex items-center justify-center border-4 border-purple-700 shadow-lg">
                <FaUser className="w-20 h-20 text-white" />
              </div>
            )}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between w-full">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                {userData.fullname}
                {isCurrent && (
                  <span className="text-purple-300 text-base">(You)</span>
                )}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-200 text-lg font-mono">
                  @{userData.email}
                </span>
                <span className="ml-2 px-2 py-0.5 bg-green-500/80 text-xs rounded-full text-white">
                  ● {userData.isActive ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {isCurrent ? (
                <Button
                  className="bg-black text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border-none shadow"
                  onClick={() => router.push("/page/profile")}
                  icon={<FiEdit />}
                  text="Edit Profile"
                />
              ) : (
                <>
                  <Button
                    icon={isFriend ? <FiUserX /> : <FiUserPlus />}
                    text={
                      isFriend
                        ? "Unfriend"
                        : friendRequestSent
                        ? "Request Sent"
                        : "Add Friend"
                    }
                    className={`${
                      friendRequestSent
                        ? "bg-gray-400"
                        : "bg-purple-600 hover:bg-purple-800"
                    } text-white`}
                    onClick={
                      user
                        ? isFriend
                          ? unfriend
                          : sendFriendRequest
                        : () => {
                            notification.warning({
                              message:
                                "Please create an account to send friend request.",
                            });
                          }
                    }
                    disabled={friendRequestSent}
                  />
                  <Button
                    onClick={handleFollowClick}
                    icon={<LuBellRing />}
                    text={`${isFollow ? "Unfollow" : "Follow"}`}
                    className={`${
                      isFollow
                        ? "bg-purple-600 hover:bg-purple-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  />
                </>
              )}
              <Button
                className="bg-black text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border-none shadow"
                onClick={() => {
                  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/page/detail_user/${id}`;
                  navigator.clipboard.writeText(link);
                  notification.success({ message: "Copied Link Successfully" });
                }}
                icon={<FiShare2 />}
                text="Share"
              />
              {userData.totalFollowers >= 1000 && userData.isShop && (
                <Button
                  icon={<FiShoppingBag />}
                  text={isCurrent ? "Store" : "My Store"}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => router.push(`/page/store/${id}`)}
                />
              )}
            </div>
          </div>
        </div>
        {/* About & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 mt-2">
          <div className="bg-[#18182c] rounded-xl p-6 shadow-lg flex flex-col gap-3">
            <h3 className="text-white font-semibold text-lg mb-2">About</h3>
            <p className="text-purple-200 text-sm">
              {userData.bio ||
                "Music producer & content creator 🎵 Sharing my journey through beats and melodies"}
            </p>
            <div className="flex items-center gap-3 text-purple-300 text-sm mt-2">
              <FiMapPin />
              <span>{userData.address || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-3 text-purple-300 text-sm">
              <FiCalendar />
              <span>
                Joined{" "}
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
          <div className="bg-[#18182c] rounded-xl p-6 shadow-lg flex flex-col gap-3">
            <h3 className="text-white font-semibold text-lg mb-2">
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="cursor-pointer hover:bg-purple-800/20 p-2 rounded-lg transition-colors"
                onClick={() => setShowFollowerModal(true)}
              >
                <div className="text-2xl font-bold text-white">
                  {userData.totalFollowers || 0}
                </div>
                <div className="text-purple-300 text-xs">Followers</div>
              </div>
              <div
                className="cursor-pointer hover:bg-purple-800/20 p-2 rounded-lg transition-colors"
                onClick={() => setShowFollowingModal(true)}
              >
                <div className="text-2xl font-bold text-white">
                  {userData.totalFollowings || 0}
                </div>
                <div className="text-purple-300 text-xs">Following</div>
              </div>
              <div className="p-2 rounded-lg transition-colors">
                <div className="text-2xl font-bold text-white">
                  {userData.totalViews || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Views</div>
              </div>
              <div className="p-2 rounded-lg transition-colors">
                <div className="text-2xl font-bold text-white">
                  {userData.totalLikes || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Likes</div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-10 px-6">
          <div className="flex gap-6 border-b border-purple-900/60 mb-6">
            {(["video", "music", "likedVideo", "likedMusic"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold text-lg transition ${
                    activeTab === tab
                      ? "border-b-2 border-purple-400 text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabConfig[tab].icon}
                  <span>{tabConfig[tab].label}</span>
                </button>
              )
            )}
          </div>
          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === "video" && <MyVideo userId={id as string} />}
            {activeTab === "music" && <ListMyMusic userId={id as string} />}
            {activeTab === "likedVideo" && <LikedVideo userId={id as string} />}
            {activeTab === "likedMusic" && (
              <ListFavoriteMusic userId={id as string} />
            )}
          </div>
        </div>
      </div>
      {/* Các modal */}
      <FollowerModal
        visible={showFollowerModal}
        onClose={() => setShowFollowerModal(false)}
        userId={id as string}
        isOwner={isCurrent}
      />
      <FollowingModal
        visible={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        userId={id as string}
        isOwner={isCurrent}
      />
    </div>
  );
};

const Button = ({
  icon,
  text,
  className,
  onClick,
  disabled,
}: {
  icon: JSX.Element;
  text?: string;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    className={`px-5 py-3 rounded-lg flex items-center space-x-2 shadow-md transition-all duration-300 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon} {text && <span>{text}</span>}
  </button>
);

export default UserDetail;
