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
  CloseOutlined,
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
  const [previewImage, setPreviewImage] = useState<string>("");

  const [editProfile, setEditProfile] = useState({
    image: profile?.image || "",
    fullname: profile?.fullname || "",
    dob: profile?.dob ? parseISO(profile.dob) : null,
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    userName: profile?.userName || "",
    bio: "Music lover and content creator. Welcome to my profile!",
    website: "https://stiktify.com",
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
          style: { backgroundColor: "#1f2937", color: "white" },
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
      notification.success({
        message: "Profile updated successfully!",
        style: { backgroundColor: "#1f2937", color: "white" },
      });
    } else {
      notification.info({
        message: "No changes detected.",
        style: { backgroundColor: "#1f2937", color: "white" },
      });
    }
  };

  const handleOpenImageModal = () => setIsImageModalOpen(true);
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setFile(null);
    setPreviewImage("");
  };

  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Kiểm tra file type ở Frontend
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        notification.error({
          message:
            "Invalid file type. Please select an image file (PNG, JPG, GIF, WEBP).",
          style: { backgroundColor: "#1f2937", color: "white" },
        });
        e.target.value = ""; // Reset input
        return;
      }

      // Kiểm tra file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        notification.error({
          message: "File size too large. Please select an image under 10MB.",
          style: { backgroundColor: "#1f2937", color: "white" },
        });
        e.target.value = ""; // Reset input
        return;
      }

      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Function để trigger modal khi click camera
  const handleCameraClick = () => {
    setIsImageModalOpen(true);
  };

  // Function to handle image upload
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
            // style: { backgroundColor: "#1f2937", color: "white" },
          });
          setIsImageModalOpen(false);
          setFile(null);
          setPreviewImage("");
        } else {
          notification.error({
            message: "No download URL returned from the upload.",
            // style: { backgroundColor: "#1f2937", color: "white" },
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        notification.error({
          message: "Error uploading image.",
          // style: { backgroundColor: "#1f2937", color: "white" },
        });
      }
    }
  };

  return (
    <div className="text-white rounded-lg w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-500">EDIT PROFILE</h1>
        <p className="text-gray-400">
          Customize your profile information and settings
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div
          className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 cursor-pointer relative overflow-hidden border-2 border-gray-600 hover:border-purple-500 transition-all duration-200"
          onClick={handleCameraClick}
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
        </div>
        {/* <div
          className=" bg-purple-500 p-2 rounded-full border-2 border-white hover:bg-purple-600 transition-colors cursor-pointer shadow-lg zIndex-999"
          onClick={(e) => {
            e.stopPropagation();
            handleCameraClick();
          }}
        >
          <CameraFilled />
          Change Image
        </div> */}
      </div>
      <Modal
        title={
          <span className="text-white text-lg font-semibold">
            Upload Profile Image
          </span>
        }
        open={isImageModalOpen}
        onCancel={handleCloseImageModal}
        footer={null}
        className="upload-image-modal"
        centered
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        styles={{
          mask: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          content: {
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
          },
          header: {
            backgroundColor: "#1f2937",
            borderBottom: "1px solid #374151",
            color: "white",
          },
          body: {
            backgroundColor: "#1f2937",
            padding: "20px",
          },
        }}
      >
        <div className="space-y-4">
          {/* Conditional rendering - ẩn upload area khi có preview */}
          {!previewImage && (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors bg-gray-800">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                id="modal-file-upload"
              />
              <label
                htmlFor="modal-file-upload"
                className="cursor-pointer block"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                  <UploadOutlined className="text-2xl text-white" />
                </div>
                <p className="text-white text-lg font-medium mb-2">
                  Click to select an image
                </p>
                <p className="text-gray-400 text-sm">
                  PNG, JPG, GIF, WEBP up to 10MB
                </p>
              </label>
            </div>
          )}

          {/* Preview section với option để change image */}
          {previewImage && (
            <div className="space-y-6 bg-gray-800 rounded-lg p-6">
              <div className="text-center">
                <p className="text-white text-lg font-medium mb-4">Preview:</p>
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mx-auto shadow-lg"
                  />
                </div>
              </div>

              {/* Option to change image */}
              <div className="text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  id="change-image-upload"
                />
                <label
                  htmlFor="change-image-upload"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-pointer transition-all duration-200 font-medium"
                >
                  <CameraFilled />
                  Change Image
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-600">
            <Button
              onClick={handleCloseImageModal}
              className="flex-1 h-12"
              style={{
                backgroundColor: "#4b5563",
                borderColor: "#4b5563",
                color: "white",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#374151";
                e.currentTarget.style.borderColor = "#374151";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4b5563";
                e.currentTarget.style.borderColor = "#4b5563";
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpImage}
              disabled={!file}
              className="flex-1 h-12"
              style={{
                backgroundColor: file ? "#8b5cf6" : "#4b5563",
                borderColor: file ? "#8b5cf6" : "#4b5563",
                color: "white",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                if (file) {
                  e.currentTarget.style.backgroundColor = "#7c3aed";
                  e.currentTarget.style.borderColor = "#7c3aed";
                }
              }}
              onMouseLeave={(e) => {
                if (file) {
                  e.currentTarget.style.backgroundColor = "#8b5cf6";
                  e.currentTarget.style.borderColor = "#8b5cf6";
                }
              }}
            >
              <UploadOutlined className="mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#24243e] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserOutlined className="mr-2 text-purple-400" /> Basic Information
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
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mt-1 text-white focus:border-purple-500 focus:outline-none transition-colors"
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
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mt-1 text-gray-400 cursor-not-allowed"
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
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mt-1 text-gray-400 cursor-not-allowed"
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
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mt-1 text-white focus:border-purple-500 focus:outline-none transition-colors [&::-webkit-input-placeholder]:text-gray-400"
                placeholder="+1 (555) 123-4567"
                style={{ backgroundColor: "#374151", color: "white" }}
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
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mt-1 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholderText="Select a date"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#24243e] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <HomeOutlined className="mr-2 text-purple-400" /> Additional
            Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Bio
              </label>
              <textarea
                name="bio"
                value={editProfile.bio}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mt-1 h-24 text-gray-400 cursor-not-allowed resize-none"
                placeholder="Tell us about yourself"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Default bio - cannot be edited
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
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mt-1 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="City, Country"
                style={{ backgroundColor: "#374151", color: "white" }}
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
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md mt-1 text-gray-400 cursor-not-allowed"
                placeholder="https://yourwebsite.com"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Default website - cannot be edited
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Button
            icon={<LockOutlined />}
            onClick={handleOpenPasswordModal}
            style={{
              backgroundColor: "#7c3aed",
              borderColor: "#7c3aed",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6d28d9";
              e.currentTarget.style.borderColor = "#6d28d9";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.borderColor = "#7c3aed";
              e.currentTarget.style.color = "white";
            }}
          >
            Change Password
          </Button>
          {/* <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              borderColor: "#dc2626",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
              e.currentTarget.style.borderColor = "#b91c1c";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
              e.currentTarget.style.borderColor = "#dc2626";
              e.currentTarget.style.color = "white";
            }}
          >
            Logout
          </Button> */}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            style={{
              backgroundColor: "#4b5563",
              borderColor: "#4b5563",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#374151";
              e.currentTarget.style.borderColor = "#374151";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4b5563";
              e.currentTarget.style.borderColor = "#4b5563";
              e.currentTarget.style.color = "white";
            }}
          >
            Cancel
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{
              backgroundColor: "#7c3aed",
              borderColor: "#7c3aed",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6d28d9";
              e.currentTarget.style.borderColor = "#6d28d9";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.borderColor = "#7c3aed";
              e.currentTarget.style.color = "white";
            }}
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
