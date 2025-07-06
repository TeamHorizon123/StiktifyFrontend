import React, { useEffect, useState, useContext } from "react";
import { Modal, Avatar, Row, Col, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { handleGetFollowerUser } from "@/actions/follow.action";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
const { Text } = Typography;

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
      title="Followers"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      className="rounded-2xl shadow-xl"
    >
      <div className="flex flex-col space-y-4">
        {followers.map((follower, index) => (
          <Row
            key={index}
            justify="space-between"
            align="middle"
            className="p-3 border-b cursor-pointer"
            onClick={() => handleFollowerClick(follower._id)}
          >
            <Col>
              <Row align="middle">
                <Avatar src={follower.image || <UserOutlined />} />
                <Text className="ml-3">{follower.userName}</Text>
              </Row>
            </Col>
          </Row>
        ))}
      </div>
    </Modal>
  );
};

export default FollowerModal;
