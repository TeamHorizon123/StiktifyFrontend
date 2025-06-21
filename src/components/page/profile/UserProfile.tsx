"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from "next/navigation";
import { Button, Modal, notification } from "antd";
import { handleUploadImage } from "@/actions/manage.user.action";

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
  onUpdateProfile: (updatedProfile: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdateProfile,
}) => {
  if (!profile) {
    return (
      <div className="text-center text-red-500">Profile data is missing.</div>
    );
  }

  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext is not available");
    return <div>Error: AuthContext is not available</div>;
  }

  const { user, logout } = context;
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Modal for image upload
  const [file, setFile] = useState(null);

  const handleLogout = () => {
    logout();
    router.replace("/page/trending-guest");
  };

  const [editProfile, setEditProfile] = useState({
    image: profile.image,
    fullname: profile.fullname || "",
    dob: profile.dob ? parseISO(profile.dob) : null,
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    userName: profile.userName || ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (date: Date | null) => {
    setEditProfile({
      ...editProfile,
      dob: date,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  const validateInputs = () => {
    setErrorMessage("");
    if (!editProfile.dob) {
      setErrorMessage("Date of Birth cannot be empty.");
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = editProfile.dob.getFullYear();
    if (year < 1900) {
      setErrorMessage("Date of Birth must be after the year 1900.");
      return false;
    }
    if (editProfile.dob >= today) {
      setErrorMessage("Date of Birth cannot be today or in the future.");
      return false;
    }

    if (!editProfile.phone) {
      setErrorMessage("Phone number cannot be empty.");
      return false;
    }
    if (!/^\d{10}$/.test(editProfile.phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return false;
    }
    if (profile.phone?.includes(editProfile.phone)) {
      setErrorMessage("Phone number already exists.");
      return false;
    }

    if (editProfile.address.split(" ").length > 150) {
      setErrorMessage("Address cannot exceed 150 words.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!user?._id) {
      console.error("User ID is missing!");
      return;
    }

    if (editProfile.phone !== profile.phone) {
      if (!/^\d{10}$/.test(editProfile.phone)) {
        setErrorMessage("Phone number must be exactly 10 digits.");
        notification.error({ message: errorMessage });
        return;
      }
      if (profile.phone?.includes(editProfile.phone)) {
        setErrorMessage("Phone number already exists.");
        notification.error({ message: errorMessage });
        return;
      }
    }

    const updateFields: any = {};
    if (editProfile.fullname !== profile.fullname) {
      updateFields.fullname = editProfile.fullname;
    }
    if (
      editProfile.dob &&
      profile.dob &&
      editProfile.dob.getTime() !== new Date(profile.dob).getTime()
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

    // Gửi yêu cầu chỉ với các trường đã thay đổi
    if (Object.keys(updateFields).length > 0) {
      const profileWithId = {
        ...updateFields,
        _id: user._id,
      };
      onUpdateProfile(profileWithId);
      setSuccessMessage("Profile updated successfully!");
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

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
      } catch (error) {
        notification.error({
          message: "Error uploading image.",
        });
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 cursor-pointer"
          onClick={handleOpenImageModal}
        >
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl text-gray-500">Choose</span>
          )}
        </div>
        <p className="text-gray-500">@{editProfile.userName || "No username"}</p>
      </div>

      <Modal
        title="Upload Image"
        open={isImageModalOpen}
        onCancel={handleCloseImageModal}
        footer={null}
      >
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <Button onClick={handleUpImage} disabled={!file}>
          Upload Image
        </Button>
      </Modal>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Fullname:</span>
          <input
            type="text"
            name="fullname"
            value={editProfile.fullname}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Email:</span>
          <input
            type="email"
            name="email"
            value={editProfile.email}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
            disabled
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Date of Birth:</span>
          <DatePicker
            selected={editProfile.dob}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="p-2 border border-gray-300 rounded-md text-gray-900 w-full"
            placeholderText="Select a date"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Phone:</span>
          <input
            type="text"
            name="phone"
            value={editProfile.phone}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Address:</span>
          <input
            type="text"
            name="address"
            value={editProfile.address}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleOpenPasswordModal}
              className="bg-blue-500 text-white mr-4 px-4 py-2 rounded"
            >
              Change Password
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white mr-4 px-4 py-2 rounded"
            >
              Logout
            </button>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Profile
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mt-4 text-center text-green-500">
            {successMessage}
          </div>
        )}
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={handleClosePasswordModal} />
      )}
    </div>
  );
};

export default UserProfile;
