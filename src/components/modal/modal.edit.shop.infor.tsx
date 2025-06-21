"use client";

import React, { useState, useEffect, useContext } from "react";
import { Input, Button, message, Typography, Spin } from "antd";
import { AuthContext } from "@/context/AuthContext";

const { Title } = Typography;

interface ShopOwnerDetail {
  shopName: string;
  taxCode: string;
  shopBrandsAddress: string;
  shopDescription: string;
}

interface UserData {
  _id: string;
  shopOwnerDetail?: ShopOwnerDetail;
}
interface EditShopOwnerDetailProps {
  onClose: () => void;
  onViewCart: () => void;
  visible: boolean;
  refreshData: () => void;
  product: {
    image: string;
    name: string;
    description: string;
    price: number;
  };
}

const EditShopOwnerDetail = ({
  onClose,
  refreshData = () => {},
}: EditShopOwnerDetailProps) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<ShopOwnerDetail>({
    shopName: "",
    taxCode: "",
    shopBrandsAddress: "",
    shopDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken || !user?._id) {
        message.error(
          "User ID or access token not found. Please log in again."
        );
        setFetching(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            responseData?.message || "Failed to fetch user information."
          );
        }

        setUserData(responseData.data);

        // Initialize form data with shopOwnerDetail if it exists
        const shopDetails =
          responseData.data.shopOwnerDetail || responseData.data;
        setFormData({
          shopName: shopDetails.shopName || "",
          taxCode: shopDetails.taxCode || "",
          shopBrandsAddress: shopDetails.shopBrandsAddress || "",
          shopDescription: shopDetails.shopDescription || "",
        });
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching user data."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [accessToken, user?._id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleSave = async () => {
    if (!accessToken || !user?._id) {
      message.error("User ID or access token not found. Please log in again.");
      return;
    }

    if (
      !formData.shopName ||
      !formData.taxCode ||
      !formData.shopBrandsAddress ||
      !formData.shopDescription
    ) {
      message.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/editShop/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData), // Send flat data
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData?.message || "Failed to update shop information."
        );
      }

      message.success("Shop information updated successfully!");
      refreshData();
      onClose();
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "An error occurred while updating shop information."
      );
    } finally {
      setLoading(false);
      setIsChanged(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin tip="Loading information..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={4}>Shop Information</Title>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Name:</label>
        <Input
          name="shopName"
          placeholder="Enter shop name"
          value={formData.shopName}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Tax Code:</label>
        <Input
          name="taxCode"
          placeholder="Enter tax code"
          value={formData.taxCode}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Address:</label>
        <Input
          name="shopBrandsAddress"
          placeholder="Enter shop address"
          value={formData.shopBrandsAddress}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Description:</label>
        <Input.TextArea
          name="shopDescription"
          placeholder="Enter shop description"
          value={formData.shopDescription}
          onChange={handleChange}
          rows={4}
          disabled={loading}
        />
      </div>

      {isChanged && (
        <p style={{ color: "orange" }}>You have unsaved changes!</p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!isChanged}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditShopOwnerDetail;
