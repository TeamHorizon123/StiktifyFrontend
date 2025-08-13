"use client";

import { useState, useContext } from "react";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { BiFlag } from "react-icons/bi";
import { X } from "lucide-react";

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

  const minLength = 10;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-[#23243a] rounded-xl p-6 w-96 max-w-[90vw] relative z-[10000] border border-[#35356b] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#a78bfa]/20 rounded-full flex items-center justify-center">
              <BiFlag className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Report Music</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-[#35356b] rounded-full p-2 transition-all duration-200"
            aria-label="Close"
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
              placeholder="Please describe the issue with this music..."
              rows={4}
              className="w-full p-3 bg-[#23234a] border border-[#35356b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] transition-all duration-200 resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum {minLength} characters required
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReport}
              disabled={loading || reason.trim().length < minLength}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${loading || reason.trim().length < minLength
                ? "bg-[#35356b] text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:from-[#a78bfa] hover:to-[#7c3aed] text-white shadow-lg hover:shadow-[#a78bfa]/25"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Reporting...
                </>
              ) : (
                <>
                  <BiFlag className="w-4 h-4" />
                  Report
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-[#35356b] hover:bg-[#35356b]/80 text-gray-200 font-semibold rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-[#35356b]/50 rounded-lg border-l-4 border-purple-500">
          <p className="text-xs text-gray-300">
            <span className="font-semibold text-purple-400">Note:</span> False reports may result in account restrictions. Please only report content that violates our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
