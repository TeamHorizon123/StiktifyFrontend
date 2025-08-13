import React, { useEffect, useState, useContext } from "react";
import { Modal, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { handleGetFollowingUser } from "@/actions/follow.action";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Following {
  _id: string;
  userName: string;
  image?: string;
  email: string;
}

const FollowingModal = ({
  visible,
  onClose,
  userId,
  isOwner = true,
}: {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  isOwner?: boolean;
}) => {
  const { user, accessToken } = useContext(AuthContext)!;
  const [following, setFollowing] = useState<Following[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (visible && (isOwner ? user : userId)) {
      const fetchFollowingData = async () => {
        try {
          const targetUserId = isOwner ? user._id : userId;
          const response = await handleGetFollowingUser(targetUserId!);
          if (response && response.data) {
            setFollowing(response.data);
          } else {
            message.error("Failed to fetch following data.");
          }
        } catch {
          message.error("Error fetching following data.");
        }
      };
      fetchFollowingData();
    }
  }, [visible, user, userId, isOwner, accessToken]);

  const handleUserClick = (userId: string) => {
    router.push(`/page/detail_user/${userId}`);
  };

  return (
    <Modal
      title={<span className="text-white text-lg font-semibold">Following</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      className="rounded-2xl shadow-xl custom-follow-modal"
      styles={{
        content: { background: "#18182c" },
        header: { background: "#111827" },
      }}
    >
      <div className="flex flex-col">
        {following.length === 0 ? (
          <div className="text-center text-purple-300 py-8">No following users found.</div>
        ) : (
          following.map((followed) => (
            <div
              key={followed._id}
              className="flex items-center gap-3 px-5 py-4 hover:bg-[#23243a] transition cursor-pointer"
              onClick={() => handleUserClick(followed._id)}
            >
              <Avatar
                src={followed.image}
                icon={<UserOutlined />}
                size={40}
                className="border border-purple-700"
              />
              <span className="text-white font-medium">{followed.userName}</span>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default FollowingModal;
