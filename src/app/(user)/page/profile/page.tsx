"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FiEdit, FiShare2, FiMapPin, FiCalendar, FiSettings } from "react-icons/fi";
import { Heart, Video, Music } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import MyVideo from "@/components/page/myvideo/MyVideo";
import ListMyMusic from "@/components/page/mymusic/list-my-music";
import LikedVideo from "@/components/page/likedVideoPost/LikedVideo";
import ListFavoriteMusic from "@/components/music/music-favorite/list.favorite";
import FollowerModal from "@/components/modal/modal.follower";
import FollowingModal from "@/components/modal/modal.following";
import { sendRequest } from "@/utils/api";
import { CheckCircleTwoTone } from "@ant-design/icons";
import TickedUser from "@/components/ticked-user/TickedUser";
import { formatNumber } from "@/utils/utils";
import avatar from "@/assets/no-avatar.png"

const TABS = [
  { key: "video", label: "Video", icon: <Video size={18} /> },
  { key: "music", label: "Music", icon: <Music size={18} /> },
  { key: "liked-video", label: "Liked Video", icon: <Heart size={18} /> },
  { key: "liked-music", label: "Liked Music", icon: <Heart size={18} /> },
];

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

interface IProfile {
  _id: string;
  image: string;
  fullname: string;
  email: string;
  bio: string;
  address: string;
  createdAt: string;
  totalFollowers: number;
  totalFollowings: number;
  views: number;
  likes: number;
  dob?: string;
  userName?: string;
  phone?: string;
}

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<IProfile | null>(null);
  const [activeTab, setActiveTab] = useState("video");
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const router = useRouter();
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [requestData, setRequestData] = useState<any>(null);

  const currentUserId = user?._id;
  const isCurrent = true;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accessToken) {
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const result = await response.json();
        setProfileData(result.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchProfileData();
  }, [accessToken]);

  const sendTickRequest = async () => {
    if (!accessToken || !currentUserId) {
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
        body: { userId: currentUserId },
      });

      if (res.statusCode === 201) {
        setRequestData(res.data);
        console.log("Tick request sent successfully");
      }
    } catch (error) {
      console.error("Failed to send Tick request", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-0 py-0 main-layout ">
      <div className="w-full max-w-6xl mx-auto pt-10 pb-16 ml-[17rem]">
        {/* Profile Header */}
        <div className="relative flex flex-col items-center md:flex-row md:items-end gap-6 px-6 pb-8">
          <div className="relative">
            {profileData?.image ? (
              <img
                src={profileData.image}
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
                {profileData?.fullname}
                <div>
                  {requestData?.status === "approved" && <CheckCircleTwoTone />}
                </div>
                <div className="text-base font-bold text-purple-300 font-normal">
                  <TickedUser userId={currentUserId} />
                </div>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-200 text-lg font-mono">
                  @{profileData?.email}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border-none shadow"
                onClick={() => router.push("/page/profile/edit")}
                icon={<FiEdit />}
                text="Edit Profile"
              />

              {/* Settings Dropdown */}
              <div className="relative">
                <Button
                  className="bg-[#18182c] hover:bg-[#2a2b4a] text-white font-semibold px-4 py-4 rounded-lg flex items-center gap-2 border border-purple-700 shadow"
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  icon={<FiSettings />}
                />

                {showSettingsDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#18182c] border border-purple-700 rounded-xl shadow-2xl z-50">
                    {/* Share Option */}
                    <button className="w-full px-4 py-3 text-left text-white hover:bg-purple-800/30 rounded-t-xl transition-colors flex items-center gap-3">
                      <FiShare2 className="text-purple-400" />
                      <span>Share Profile</span>
                    </button>

                    {/* Request Tick - Always show if isCurrent */}
                    {isCurrent && (
                      <button
                        className={`w-full px-4 py-3 text-left rounded-b-xl transition-colors flex items-center gap-3 ${(profileData?.totalFollowers ?? 0) < 1000
                          ? "text-gray-400 bg-gray-400/10 cursor-not-allowed"
                          : requestData?.status === "pending"
                            ? "text-yellow-400 bg-yellow-400/10 cursor-not-allowed"
                            : requestData?.status === "approved"
                              ? "text-green-400 bg-green-400/10 cursor-not-allowed"
                              : "text-white hover:bg-purple-800/30"
                          }`}
                        onClick={
                          (profileData?.totalFollowers ?? 0) < 1000 ||
                            requestData?.status === "pending" ||
                            requestData?.status === "approved"
                            ? undefined
                            : sendTickRequest
                        }
                        disabled={
                          (profileData?.totalFollowers ?? 0) < 1000 ||
                          requestData?.status === "pending" ||
                          requestData?.status === "approved"
                        }
                      >
                        <CheckCircleTwoTone className="text-blue-400" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {(profileData?.totalFollowers ?? 0) < 1000
                              ? "Cannot Request Verification"
                              : requestData?.status === "pending"
                                ? "Request Processing..."
                                : requestData?.status === "approved"
                                  ? "Verified Account"
                                  : "Request Verification"
                            }
                          </span>
                          <span className="text-xs text-purple-300">
                            {(profileData?.totalFollowers ?? 0) < 1000
                              ? `Need ${1000 - (profileData?.totalFollowers ?? 0)} more followers`
                              : !requestData?.status
                                ? "Get verified badge"
                                : ""
                            }
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay to close dropdown when clicking outside */}
        {showSettingsDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettingsDropdown(false)}
          />
        )}

        {/* About & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 mt-2">
          <div className="bg-[#18182c] rounded-xl p-6 shadow-lg flex flex-col gap-3">
            <h3 className="text-white font-semibold text-lg mb-2">About</h3>
            <p className="text-purple-200 text-sm">
              {profileData?.bio ||
                "Music producer & content creator 🎵 Sharing my journey through beats and melodies"}
            </p>
            <div className="flex items-center gap-3 text-purple-300 text-sm mt-2">
              <FiMapPin />
              <span>{profileData?.address || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-3 text-purple-300 text-sm">
              <FiCalendar />
              <span>
                Joined{" "}
                {profileData?.createdAt
                  ? new Date(profileData.createdAt).toLocaleDateString()
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
                  {profileData?.totalFollowers ? formatNumber(profileData.totalFollowers) : 0}
                </div>
                <div className="text-purple-300 text-xs">Followers</div>
              </div>
              <div
                className="cursor-pointer hover:bg-purple-800/20 p-2 rounded-lg transition-colors"
                onClick={() => setShowFollowingModal(true)}
              >
                <div className="text-2xl font-bold text-white">
                  {profileData?.totalFollowings ? formatNumber(profileData.totalFollowings) : 0}
                </div>
                <div className="text-purple-300 text-xs">Following</div>
              </div>
              {/* <div className="p-2 rounded-lg transition-colors">
                <div className="text-2xl font-bold text-white">
                  {profileData?.views || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Views</div>
              </div> */}
              {/* <div className="p-2 rounded-lg transition-colors">
                <div className="text-2xl font-bold text-white">
                  {profileData?.likes || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Likes</div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 px-6">
          <div className="flex gap-6 border-b border-purple-900/60 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-4 py-2 font-semibold text-lg transition ${activeTab === tab.key
                  ? "border-b-2 border-purple-400 text-white"
                  : "text-purple-300 hover:text-white"
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === "video" && profileData?._id && <MyVideo />}
            {activeTab === "music" && profileData?._id && <ListMyMusic />}
            {activeTab === "liked-video" && profileData?._id && <LikedVideo />}
            {activeTab === "liked-music" && profileData?._id && (
              <ListFavoriteMusic userId={currentUserId} />
            )}
          </div>
        </div>
      </div>

      {/* Follower Modal */}
      <FollowerModal
        visible={showFollowerModal}
        onClose={() => setShowFollowerModal(false)}
        userId={profileData?._id}
        isOwner={true}
      />

      {/* Following Modal */}
      <FollowingModal
        visible={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        userId={profileData?._id}
        isOwner={true}
      />
    </div>
  );
};

export default ProfilePage;
