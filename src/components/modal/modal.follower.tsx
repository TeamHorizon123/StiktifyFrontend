import React, { useEffect, useState, useContext } from "react";
import { Modal, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { handleGetFollowerUser } from "@/actions/follow.action";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Follower {
  _id: string;
  userName: string;
  image?: string;
  email: string;
}

const FollowerModal = ({
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
  const [followers, setFollowers] = useState<Follower[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (visible && (isOwner ? user : userId)) {
      const fetchFollowersData = async () => {
        try {
          const targetUserId = isOwner ? user._id : userId;
          const response = await handleGetFollowerUser(targetUserId!);
          if (response && response.data) {
            setFollowers(response.data);
          } else {
            message.error("Failed to fetch followers.");
          }
        } catch {
          message.error("Error fetching followers data.");
        }
      };
      fetchFollowersData();
    }
  }, [visible, user, userId, isOwner, accessToken]);

  const handleFollowerClick = (followerId: string) => {
    router.push(`/page/detail_user/${followerId}`);
  };

  return (
    <Modal
      title={
        <span className="text-white text-lg font-semibold">Followers</span>
      }
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
        {followers.length === 0 ? (
          <div className="text-center text-purple-300 py-8">
            No followers found.
          </div>
        ) : (
          followers.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center gap-3 px-5 py-4 hover:bg-[#23243a] transition cursor-pointer"
              onClick={() => handleFollowerClick(follower._id)}
            >
              <Avatar
                src={follower.image}
                icon={<UserOutlined />}
                size={40}
                className="border border-purple-700"
              />
              <span className="text-white font-medium">{follower.userName}</span>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default FollowerModal;
