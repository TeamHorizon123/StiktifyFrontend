"use client";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext } from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { DashboardContext } from "@/library/dashboard.context";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const { Header } = Layout;
  const { collapseMenu, setCollapseMenu } = useContext(DashboardContext)!;

  const { logout } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const handleLogout = () => {
    logout!(), router.replace("/auth/login");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </Link>
      ),
      icon: <SmileOutlined />,
      // disabled: true,
    },

    {
      key: "4",
      danger: true,
      label: <>Logout</>,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "#f5f5f5",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapseMenu(!collapseMenu)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              color: "unset",
              lineHeight: "0 !important",
              marginRight: 20,
            }}
          >
            <Space>
              Welcome Admin
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default DashboardHeader;
