"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaUser, FaRegEnvelope, FaEllipsisH } from "react-icons/fa";
import {
  FiEdit,
  // FiMessageSquare,
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
import { useRouter } from "next/navigation";
import { CheckCircleTwoTone } from "@ant-design/icons";
import BusinessAccountModal from "@/components/modal/modal.upgrade.to.business.account";
import FollowerModal from "@/components/modal/modal.follower";
import FollowingModal from "@/components/modal/modal.following";
import { checkFollowAction, handleFollow } from "@/actions/manage.follow.action";
import { message } from "antd";

// ======= Interfaces for User & Video =======
interface User {
  _id: string;
  userName: string;
  fullname: string;
  email: string;
  isBan: boolean;
  status: string;
  role: string;
  accountType: string;
  isActive: boolean;
  totalFollowers: number;
  totalFollowings: number;
  isShop: boolean;
}

const UserDetail = () => {
  // const [totalFollowers, setTotalFollowers] = useState(1000);
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [userData, setUserData] = useState<User | null>(null);
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "video" | "music" | "likedVideo" | "likedMusic"
  >("video");
  const isCurrent = user?._id === id;
  const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollow, setFollow] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await checkFollowAction(user?._id, id + "")
      if (res?.statusCode === 201) {
        setFollow(res?.data)
      } else {
        setFollow(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (id && accessToken) {
      fetchUserDetail();
      checkFriend();
    }
  }, [id, accessToken]);

  const fetchRequestById = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res?.statusCode === 404 || res?.error === "Not Found") {
        return;
      }

      if (res?.data) {
        console.log(res.data);
        setRequestData(res.data);
      }
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 404) return;

      setError("Failed to get request");
      console.error(err);
    }
  };

  const fetchUserDetail = async () => {
    try {
      const res = await sendRequest<{ data: User }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data) {
        fetchRequestById();
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
  const sendTickRequest = async () => {
    if (!accessToken) {
      console.error("User not authenticated");
      return;
    }
    try {
      const res = await sendRequest<any>({
        url: "http://localhost:8080/api/v1/ticked-users",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: { userId: id },
      });

      if (res.statusCode === 201) {
        setRequestData(res.data);
        console.log("Tick request sent successfully");
      }
    } catch (error) {
      console.error("Failed to send Tick request", error);
    }
  };
  const handleOpenBusinessModal = () => {
    setShowBusinessModal(false);
    setTimeout(() => setShowBusinessModal(true), 0);
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userData)
    return <p className="text-center text-gray-600">No user data</p>;

  const handleStoreClick = () => {
    if (userData.totalFollowers >= 1000 && userData.isShop) {
      router.push(`/page/store/${id}`);
    }
  };
  const canAccessStore = userData.totalFollowers >= 1000 && userData.isShop;

  const tabLabels: Record<
    "video" | "music" | "likedVideo" | "likedMusic",
    string
  > = {
    video: "Video",
    music: "Music",
    likedVideo: "Liked Video",
    likedMusic: "Liked Music",
  };

  const handleUpgradeSuccess = () => {
    setIsUpgraded(true);
    setShowBusinessModal(true);
    router.refresh();
  };

  const handleFollowA = async () => {
    const res = await handleFollow(user?._id, id + "");
    if (res?.statusCode === 201) {
      message.success(res.data.message)
      setFollow(!isFollow)
    }
  }


  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white border rounded-2xl shadow-2xl transition-shadow duration-300 min-h-screen max-h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 to-red-500 text-white flex items-center justify-center text-6xl shadow-lg">
          <FaUser />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="flex text-4xl font-bold text-gray-800">
              {userData.fullname} {isCurrent && "(You)"}
            </h1>
            {userData.totalFollowers >= 1000 &&
              isCurrent &&
              requestData?.status !== "approved" && (
                // <Button
                //   icon={<FaUser />}
                //   text="Request Tick Xanh"
                //   className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-1 py-1 space-x-2"
                //   onClick={() => console.log("Request for Tick")}
                // />
                <button
                  className={`h-6 px-1 py-1 rounded-md flex items-center space-x-1 shadow-md transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white text-[10px]`}
                  onClick={sendTickRequest}
                  disabled={requestData?.status === "pending"}
                >
                  <CheckCircleTwoTone />{" "}
                  {requestData?.status === "pending" ? (
                    <span>Request processing...</span>
                  ) : (
                    <span>Request for Tick</span>
                  )}
                </button>
              )}

            {requestData?.status === "approved" && <CheckCircleTwoTone />}
          </div>
          <p className="flex items-center text-lg font-medium mt-1">
            <span
              className={`w-3 h-3 mr-2 rounded-full ${userData.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
            ></span>
            {userData.isActive ? "Online" : "Offline"}
          </p>

          {isCurrent ? (
            <div className="flex space-x-4 mt-3">
              <Button
                icon={<FiEdit />}
                text="Edit Profile"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => router.push("/page/profile")}
              />

              {canAccessStore && (
                <Button
                  icon={<FiShoppingBag />}
                  text="Store"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={handleStoreClick}
                />
              )}
              <Button
                icon={<FiShare2 />}
                text="Share"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
              <div>
                <div>
                  <div
                    className="flex items-center justify-between"
                    onClick={() => setIsFollowersModalVisible(true)}
                  >
                    <p className="text-ellipsis font-bold text-black">
                      {userData.totalFollowers || 0}
                    </p>
                    <p className="text-gray-600">Followers</p>
                  </div>
                  {isFollowersModalVisible && (
                    <FollowerModal
                      visible={isFollowersModalVisible}
                      onClose={() => setIsFollowersModalVisible(false)}
                    />
                  )}
                </div>
                <div>
                  <div
                    className="flex items-center justify-between"
                    onClick={() => setIsFollowingModalVisible(true)} // Đổi modal tương ứng cho "following"
                  >
                    <p className="text-nowrap font-bold text-black">
                      {userData.totalFollowings || 0}
                    </p>
                    <p className="text-gray-600">Following</p>
                  </div>
                  {isFollowingModalVisible && (
                    <FollowingModal
                      visible={isFollowingModalVisible}
                      onClose={() => setIsFollowingModalVisible(false)} // Đóng modal "following"
                    />
                  )}
                </div>
              </div>
              {userData.totalFollowers >= 1000 &&
                !isUpgraded &&
                !userData.isShop && (
                  <div className="flex space-x-4 mt-3">
                    <button
                      onClick={handleOpenBusinessModal}
                      className="px-4 py-2 bg-yellow-400 hover:bg-green-500 text-white rounded-lg flex items-center space-x-2 transition-all duration-500 ease-in-out shadow-md"
                    >
                      <span>Upgrade to business account now!</span>
                    </button>

                    {showBusinessModal && (
                      <BusinessAccountModal
                        totalFollowers={userData.totalFollowers}
                        onClose={() => setShowBusinessModal(false)}
                        onUpgradeSuccess={handleUpgradeSuccess}
                      />
                    )}
                  </div>
                )}
            </div>
          ) : (
            <div className="flex space-x-4 mt-3">
              <Button
                icon={isFriend ? <FiUserX /> : <FiUserPlus />}
                text={
                  isFriend
                    ? "Unfriend"
                    : friendRequestSent
                      ? "Request Sent"
                      : "Add Friend"
                }
                className={`${friendRequestSent
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                onClick={isFriend ? unfriend : sendFriendRequest}
                disabled={friendRequestSent}
              />
              <Button
                onClick={() => handleFollowA()}
                icon={<LuBellRing />}
                text={`${isFollow ? "Unfollow" : "Follow"}`}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
              {canAccessStore && (
                <Button
                  icon={<FiShoppingBag />}
                  text="My Store"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={handleStoreClick}
                />
              )}
              <Button
                icon={<FiShare2 />}
                text="Share"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
              <Button
                icon={<FaEllipsisH />}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex justify-around border-b-2 pb-2">
          {(["video", "music", "likedVideo", "likedMusic"] as const).map(
            (tab) => (
              <button
                key={tab}
                className={`text-lg font-semibold p-2 flex-1 text-center ${activeTab === tab
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "text-gray-600"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            )
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "video" && <VideoTab />}
          {activeTab === "music" && <MusicTab />}
          {activeTab === "likedVideo" && <LikedVideoTab />}
          {activeTab === "likedMusic" && <LikedMusicTab userId={user._id} />}
        </div>
      </div>
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
  onClick?: any;
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

const VideoTab = () => (
  <div>
    <MyVideo />
  </div>
);

const MusicTab = () => (
  <div>
    <ListMyMusic />
  </div>
);

const LikedVideoTab = () => (
  <div>
    <LikedVideo />
  </div>
);
const LikedMusicTab = ({ userId }: { userId: string }) => (
  <div>
    <ListFavoriteMusic />
  </div>
);

export default UserDetail;
