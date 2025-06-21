"use client";

import { useState, useContext } from "react";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

const ReportModal: React.FC<{
  onClose: () => void;
  musicId: string | undefined;
}> = ({ onClose, musicId }) => {
  const [reason, setReason] = useState("");
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!reason.trim()) {
      notification.error({ message: "Report content cannot be empty!" });
      return;
    }

    if (!accessToken) {
      notification.error({ message: "Unauthorized. Please log in again." });
      return;
    }

    if (!musicId) {
      notification.error({ message: "Invalid music ID." });
      return;
    }

    setLoading(true);
    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/report-music`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          musicId,
          userId: user._id,
          reasons: reason,
        },
      });

      if (response.statusCode === 201) {
        notification.success({ message: "Report submitted successfully!" });
        setReason("");
        onClose();
      } else {
        notification.error({
          message: response.message || "Failed to submit report.",
        });
      }
    } catch (error) {
      notification.error({
        message: "An error occurred while submitting the report.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center">Report Music</h2>

        <div>
          <label className="block mb-2">Reason for reporting:</label>
          <textarea
            id="reportContent"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
            required
          />
          <button
            onClick={handleReport}
            disabled={loading}
            className={`w-full p-2 mt-4 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
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

export default ReportModal;
