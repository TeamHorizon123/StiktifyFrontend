import React, { useEffect, useState, useContext } from "react";
import { Modal, Avatar, Row, Col, Typography, Spin, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { handleGetFollowingUser } from "@/actions/follow.action";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface Following {
  _id: string;
  userName: string;
  image?: string;
  email: string;
}

const FollowingModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { user, accessToken } = useContext(AuthContext)!;
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (visible && user) {
      const fetchFollowingData = async () => {
        try {
          const response = await handleGetFollowingUser(user._id);
          if (response && response.data) {
            setFollowing(response.data); 
          } else {
            message.error("Failed to fetch following data.");
          }
        } catch (error) {
          message.error("Error fetching following data.");
        }
        setLoading(false);
      };
      fetchFollowingData();
    }
  }, [visible, user, accessToken]);

  const handleUserClick = (userId: string) => {
    router.push(`/page/detail_user/${userId}`);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!following.length) {
    return <div>No following found</div>;
  }

  return (
    <Modal
      title="Following"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      className="rounded-2xl shadow-xl"
    >

      <div className="flex flex-col space-y-4">
        {following.map((followed, index) => (
          <Row
            key={index}
            justify="space-between"
            align="middle"
            className="p-3 border-b cursor-pointer"
            onClick={() => handleUserClick(followed._id)}
          >
            <Col>
              <Row align="middle">
                <Avatar src={followed.image || <UserOutlined />} />
                <Text className="ml-3">{followed.userName}</Text>
              </Row>
            </Col>
          </Row>
        ))}
      </div>
    </Modal>
  );
};

export default FollowingModal;
