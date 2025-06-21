import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { CheckCircleTwoTone } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";

interface TickedUserProps {
  userId: string;
}
const TickedUser: React.FC<TickedUserProps> = ({ userId }) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    setRequestData(null);
    if (userId && accessToken) fetchRequestById();
  }, [userId, accessToken]);

  const fetchRequestById = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res?.statusCode === 404 || res?.error === "Not Found") {
        return;
      }

      if (res?.data) {
        console.log(res.data);
        setRequestData(res.data);
      }
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 404) return;
      console.error(err);
    }
  };

  return (
    <>{requestData?.status === "approved" ? <CheckCircleTwoTone /> : ""}</>
  );
};

export default TickedUser;
