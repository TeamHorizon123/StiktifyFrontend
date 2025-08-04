"use client";

import { useState, useContext } from "react";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { X, Flag } from "lucide-react";

const ReportModal: React.FC<{
  onClose: () => void;
  videoId: string | undefined;
}> = ({ onClose, videoId }) => {
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

    if (!videoId) {
      notification.error({ message: "Invalid video ID." });
      return;
    }

    setLoading(true);
    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/report-video`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          videoId,
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-96 max-w-[90vw] relative z-[10000] border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Report Video</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for reporting:
            </label>
            <textarea
              id="reportContent"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe the issue with this video..."
              rows={4}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum 10 characters required
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReport}
              disabled={loading || reason.trim().length < 10}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || reason.trim().length < 10
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  Report
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-gray-200 font-semibold rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border-l-4 border-yellow-500">
          <p className="text-xs text-gray-300">
            <span className="font-semibold text-yellow-400">Note:</span> False
            reports may result in account restrictions. Please only report
            content that violates our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
