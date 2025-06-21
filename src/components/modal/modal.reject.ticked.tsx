"use client";

import { useState, useContext } from "react";
import { sendRequest } from "@/utils/api";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { handleDenyUserTickedAction } from "@/actions/manage.user.ticked.action";

interface RejectTickProps {
  onClose: () => void;
  tickedUser: any;
}

const RejectTickModal: React.FC<RejectTickProps> = ({
  onClose,
  tickedUser,
}) => {
  const [email] = useState(tickedUser?.userData.email || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDenyUserTicked = async (id: string, reason: string) => {
    const res = await handleDenyUserTickedAction(id, reason);
    if (res?.success) {
      setReason("");
      onClose();
      return notification.success({ message: res?.message });
    }
    return notification.error({ message: res?.message });
  };
  const handleReject: any = (id: string) => {
    handleDenyUserTicked(id, reason);
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
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Input reason"
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
            required
          />
          <button
            onClick={() => handleReject(tickedUser.tickedRequests[0].id)}
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

export default RejectTickModal;
