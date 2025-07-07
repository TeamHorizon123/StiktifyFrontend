"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from "next/navigation";
import { Button, Modal, notification } from "antd";
import { handleUploadImage } from "../../../actions/manage.user.action";
import {
  UserOutlined,
  HomeOutlined,
  UploadOutlined,
  LockOutlined,
  LogoutOutlined,
  SaveOutlined,
  BellOutlined,
  EyeOutlined,
  BarChartOutlined,
  MessageOutlined,
  CameraFilled,
} from "@ant-design/icons";

interface IUpdateProfile {
  fullname?: string;
  dob?: string;
  phone?: string;
  address?: string;
  image?: string;
  _id?: string;
}

interface UserProfileProps {
  profile?: {
    image: string;
    fullname: string;
    dob: string;
    email: string;
    userName: string;
    phone: string;
    address: string;
  };
  onUpdateProfile: (updatedProfile: IUpdateProfile) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [editProfile, setEditProfile] = useState({
    image: profile?.image || "",
    fullname: profile?.fullname || "",
    dob: profile?.dob ? parseISO(profile.dob) : null,
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    userName: profile?.userName || "",
    bio: "81/1500 characters",
    website: "https://yourwebsite.com",
  });

  if (!profile) {
    return (
      <div className="text-center text-red-500">Profile data is missing.</div>
    );
  }

  if (!context) {
    console.error("AuthContext is not available");
    return <div>Error: AuthContext is not available</div>;
  }

  const { user, logout } = context;

  const handleLogout = () => {
    logout();
    router.replace("/page/trending");
  };

  const handleDateChange = (date: Date | null) => {
    setEditProfile({
      ...editProfile,
      dob: date,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (!user?._id) {
      console.error("User ID is missing!");
      return;
    }

    if (editProfile.phone !== profile.phone) {
      if (!/^\d{10}$/.test(editProfile.phone)) {
        notification.error({
          message: "Phone number must be exactly 10 digits.",
        });
        return;
      }
    }

    const updateFields: IUpdateProfile = {};
    if (editProfile.fullname !== profile.fullname) {
      updateFields.fullname = editProfile.fullname;
    }
    if (
      editProfile.dob &&
      (!profile.dob ||
        editProfile.dob.getTime() !== new Date(profile.dob).getTime())
    ) {
      updateFields.dob = format(editProfile.dob, "yyyy-MM-dd");
    }
    if (editProfile.phone !== profile.phone) {
      updateFields.phone = editProfile.phone;
    }
    if (editProfile.address !== profile.address) {
      updateFields.address = editProfile.address;
    }
    if (editProfile.image !== profile.image) {
      updateFields.image = editProfile.image;
    }

    if (Object.keys(updateFields).length > 0) {
      const profileWithId = {
        ...updateFields,
        _id: user._id,
      };
      onUpdateProfile(profileWithId);
      notification.success({ message: "Profile updated successfully!" });
    } else {
      notification.info({
        message: "No changes detected.",
      });
    }
  };

  const handleOpenImageModal = () => setIsImageModalOpen(true);
  const handleCloseImageModal = () => setIsImageModalOpen(false);

  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpImage = async () => {
    if (file) {
      try {
        const folder = "avatars";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const result = await handleUploadImage(formData);
        const downloadUrl = result?.data;
        if (downloadUrl) {
          setEditProfile((prevState) => ({
            ...prevState,
            image: downloadUrl,
          }));
          notification.success({
            message: "Image uploaded successfully!",
          });
          setIsImageModalOpen(false);
        } else {
          notification.error({
            message: "No download URL returned from the upload.",
          });
        }
      } catch {
        notification.error({
          message: "Error uploading image.",
        });
      }
    }
  };

  return (
    <div className=" text-white rounded-lg w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-500">EDIT PROFILE</h1>
        <p className="text-gray-400">
          Customize your profile information and settings
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div
          className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 cursor-pointer relative"
          onClick={handleOpenImageModal}
        >
          {editProfile.image ? (
            <img
              src={editProfile.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <UserOutlined className="text-5xl text-gray-400" />
          )}
          <div className="absolute bottom-0 right-0 bg-purple-500 pl-1 pr-1 rounded-full border-2">
            <CameraFilled />
          </div>
        </div>
        {/* <Button
          icon={<UploadOutlined />}
          onClick={handleOpenImageModal}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Upload New Photo
        </Button> */}
      </div>

      <Modal
        title="Upload Image"
        open={isImageModalOpen}
        onCancel={handleCloseImageModal}
        footer={null}
        className="dark-modal"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        <Button
          onClick={handleUpImage}
          disabled={!file}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Upload Image
        </Button>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#24243e] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserOutlined className="mr-2" /> Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={editProfile.fullname}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={editProfile.userName}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md mt-1"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={editProfile.email}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md mt-1"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={editProfile.phone}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Date of Birth
              </label>
              <DatePicker
                selected={editProfile.dob}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1"
                placeholderText="Select a date"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#24243e] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <HomeOutlined className="mr-2" /> Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Bio
              </label>
              <textarea
                name="bio"
                value={editProfile.bio}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1 h-24"
                placeholder="Tell us about yourself"
              />
              <p className="text-xs text-gray-500 mt-1">
                {editProfile.bio.length}/1500 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Location
              </label>
              <input
                type="text"
                name="address"
                value={editProfile.address}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={editProfile.website}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-1"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-[#24243e] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <LockOutlined className="mr-2" /> Privacy & Security
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-semibold flex items-center">
              <EyeOutlined className="mr-2" /> Profile Visibility
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Who can see your profile
            </p>
            <select className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md">
              <option>Public</option>
              <option>Friends</option>
              <option>Private</option>
            </select>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-semibold flex items-center">
              <BarChartOutlined className="mr-2" /> Activity Status
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Show when you're online
            </p>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              Enabled
            </Button>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-semibold flex items-center">
              <MessageOutlined className="mr-2" /> Messages
            </h3>
            <p className="text-sm text-gray-400 mb-2">Who can message you</p>
            <select className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md">
              <option>Everyone</option>
              <option>Friends</option>
              <option>No one</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* <div className="bg-[#24243e] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BellOutlined className="mr-2" /> Notification Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Email Notifications</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>New Followers</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Likes on Content</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Comments</span>
                <Button className="bg-red-500 w-16">Off</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct Messages</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Push Notifications</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>New Followers</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Likes on Content</span>
                <Button className="bg-red-500 w-16">Off</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Comments</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct Messages</span>
                <Button className="bg-green-500 w-16">On</Button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex justify-between items-center">
        <div>
          <Button
            icon={<LockOutlined />}
            onClick={handleOpenPasswordModal}
            className="bg-blue-500 hover:bg-blue-600 mr-2"
          >
            Change Password
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
        <div>
          <Button
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 mr-2"
          >
            Cancel
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={handleClosePasswordModal} />
      )}
    </div>
  );
};

export default UserProfile;
