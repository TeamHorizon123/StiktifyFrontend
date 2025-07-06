"use client";

import { useState, useEffect, useContext } from "react";
import UserProfile from "@/components/page/profile/UserProfile";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Modal } from "antd";
import { FiEdit, FiShare2, FiMapPin, FiCalendar } from "react-icons/fi";
import { Heart, Video, Music } from "lucide-react";
import { FaUser } from "react-icons/fa";
import MyVideo from "@/components/page/myvideo/MyVideo";
import ListMyMusic from "@/components/page/mymusic/list-my-music";
import LikedVideo from "@/components/page/likedVideoPost/LikedVideo";
import ListFavoriteMusic from "@/components/music/music-favorite/list.favorite";
import FollowerModal from "@/components/modal/modal.follower";
import FollowingModal from "@/components/modal/modal.following";

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

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("video");
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const { accessToken, user } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accessToken) {
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [accessToken]);

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-profile`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: updatedProfile,
      });
      setProfileData(res.data);
    } catch (error) {}
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-0 py-0">
      <div className="w-full max-w-6xl mx-auto pt-10 pb-16">
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
                <span className="text-base font-bold text-purple-300 font-normal">
                  (You)
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-200 text-lg font-mono">
                  @{profileData?.email}
                </span>
                <span className="ml-2 px-2 py-0.5 bg-green-500/80 text-xs rounded-full text-white">
                  ● Online
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border-none shadow"
                onClick={() => setShowEdit(true)}
                icon={<FiEdit />}
                text="Edit Profile"
              />
              <Button
                className="bg-black text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border-none shadow"
                icon={<FiShare2 />}
                text="Share"
              />
            </div>
          </div>
        </div>
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
              <span>{profileData?.address || "Can Tho"}</span>
            </div>
            <div className="flex items-center gap-3 text-purple-300 text-sm">
              <FiCalendar />
              <span>
                Joined{" "}
                {profileData?.createdAt
                  ? new Date(profileData.createdAt).toLocaleDateString()
                  : "March 2020"}
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
                  {profileData?.totalFollowers || 0}
                </div>
                <div className="text-purple-300 text-xs">Followers</div>
              </div>
              <div
                className="cursor-pointer hover:bg-purple-800/20 p-2 rounded-lg transition-colors"
                onClick={() => setShowFollowingModal(true)}
              >
                <div className="text-2xl font-bold text-white">
                  {profileData?.totalFollowings || 0}
                </div>
                <div className="text-purple-300 text-xs">Following</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {profileData?.views || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {profileData?.likes || 0}
                </div>
                <div className="text-purple-300 text-xs">Total Likes</div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-10 px-6">
          <div className="flex gap-6 border-b border-purple-900/60 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-4 py-2 font-semibold text-lg transition ${
                  activeTab === tab.key
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
              <ListFavoriteMusic />
            )}
          </div>
        </div>
      </div>
      {/* Modal Edit Profile */}
      <Modal
        open={showEdit}
        onCancel={() => setShowEdit(false)}
        footer={null}
        title="Edit Profile"
        destroyOnClose
        centered
      >
        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : profileData ? (
          <UserProfile
            profile={profileData}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : (
          <p className="text-red-500">User profile not found</p>
        )}
      </Modal>

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
