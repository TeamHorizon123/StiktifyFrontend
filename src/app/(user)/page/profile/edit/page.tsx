"use client";

import { useState, useEffect, useContext } from "react";
import UserProfile from "@/components/page/profile/UserProfile";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface IUpdateProfile {
  fullname?: string;
  dob?: string;
  phone?: string;
  address?: string;
  image?: string;
  _id?: string;
}

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

const EditProfilePage = () => {
  const [profileData, setProfileData] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext) ?? {};

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
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [accessToken]);

  const handleUpdateProfile = async (updatedProfile: IUpdateProfile) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      const res = await sendRequest<IProfile>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-profile`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: updatedProfile,
      });
      setProfileData(res);
    } catch {
      // You can add error handling here
    }
  };

  return (
    <div className="main-layout min-h-screen w-full flex flex-col items-center px-0 py-0">
      <div className="w-full max-w-4xl mx-auto pt-10 pb-16">
        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : profileData ? (
          <UserProfile
            profile={{
              ...profileData,
              dob: profileData.dob || "",
              userName: profileData.userName || "",
              phone: profileData.phone || "",
            }}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : (
          <p className="text-red-500">User profile not found</p>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
