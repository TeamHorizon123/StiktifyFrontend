"use client";

import { useState, useContext } from "react";
import { sendRequest } from "@/utils/api";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";

interface SendEmailModalProps {
  onClose: () => void;
  user: any;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ onClose, user }) => {
  const [email] = useState(user?.email || "");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthContext) ?? {};

  const handleSendEmail = async () => {
    if (!content.trim()) {
      notification.error({ message: "Content cannot be empty!" });
      return;
    }

    if (!email) {
      notification.error({ message: "Email is not valid!" });
      return;
    }
    if (!accessToken) {
      notification.error({ message: "Unauthorized. Please log in again." });
      return;
    }

    setLoading(true);
    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/send-email`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: { email, content },
      });
      if (response.statusCode === 201) {
        notification.success({ message: "Email sent successfully!" });
        setContent("");
        onClose();
      } else {
        notification.error({
          message: response.message || "Failed to send email.",
        });
      }
    } catch (error) {
      notification.error({
        message: "An error occurred while sending the email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center">
          Send Email To User
        </h2>

        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200"
          />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Input content"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
            required
          />
          <button
            onClick={handleSendEmail}
            disabled={loading}
            className={`w-full p-2 mt-4 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white p-2 mt-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SendEmailModal;
