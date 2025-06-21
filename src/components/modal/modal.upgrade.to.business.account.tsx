import React, { useState, useEffect, useContext } from "react";
import { Modal, Input, Button, message } from "antd";
import { AuthContext } from "@/context/AuthContext";

const BusinessAccountModal = ({
  totalFollowers,
}: {
  totalFollowers: number;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [isOpen, setIsOpen] = useState(false);
  const [shopName, setShopName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [shopBrandsAddress, setShopBrandsAddress] = useState("");
  const [shopDescription, setShopDescription] = useState("");

  useEffect(() => {
    if (totalFollowers >= 1000) {
      setIsOpen(true);
    }
  }, [totalFollowers]);

  const handleRegister = async () => {
    if (!shopName || !taxCode || !shopBrandsAddress || !shopDescription) {
      message.warning("Please fill in all fields.");
      return;
    }

    if (!user?._id) {
      message.error("User ID not found.");
      return;
    }

    const businessAccountData = {
      shopName,
      taxCode,
      shopBrandsAddress,
      shopDescription,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/register-business-account/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(businessAccountData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.message || "Failed to register business account."
        );
      }

      message.success("Business account registered successfully!");
      setIsOpen(false);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <Modal
      title="Register Business Account"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
          Close
        </Button>,
        <Button key="submit" type="default" onClick={handleRegister}>
          Register
        </Button>,
      ]}
    >
      <Input
        placeholder="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Tax Code"
        value={taxCode}
        onChange={(e) => setTaxCode(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Shop's Brand Address"
        value={shopBrandsAddress}
        onChange={(e) => setShopBrandsAddress(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        placeholder="Shop Description"
        value={shopDescription}
        onChange={(e) => setShopDescription(e.target.value)}
        style={{ marginBottom: 10 }}
        rows={4}
      />
    </Modal>
  );
};

export default BusinessAccountModal;
