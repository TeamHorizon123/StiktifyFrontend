import React, { useEffect, useState, useContext } from "react";
import { Modal, Avatar, Row, Col, Typography, Spin, message } from "antd";
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
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { user, accessToken } = useContext(AuthContext)!;
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    console.log("User from AuthContext:", user);
    if (visible && user) {
      const fetchFollowersData = async () => {
        try {
          const response = await handleGetFollowerUser(user._id);
          console.log("API response:", response);
          if (response && response.data) {
            setFollowers(response.data); // Set danh sách followers
          } else {
            message.error("Failed to fetch followers.");
          }
        } catch (error) {
          message.error("Error fetching followers data.");
        }
        setLoading(false);
      };
      fetchFollowersData();
    }
  }, [visible, user, accessToken]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!followers.length) {
    return <div>No followers found</div>;
  }

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
