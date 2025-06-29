"use client";

import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { Dropdown, Menu, MenuProps, Modal } from "antd";
import { AuthContext } from "@/context/AuthContext";
import UploadVideoPost from "@/components/page/trending/upload_video_post";
import NotificationModel from "@/components/notification/NotificationModal";

interface HeaderProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isGuest: boolean;
  onClick?: (value?: any) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchValue,
  setSearchValue,
  isGuest,
  onClick,
}) => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext) ?? {};
  const userId = user?._id;

const handleLogout = () => {
  logout!();
  window.location.href = "/page/trending"; // hard reload
};


  // State quản lý modal upload video
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel=""
          onClick={() => {
            router.push("/page/profile");
          }}
        >
          My Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel=""
          onClick={() => {
            router.push("/personal/videohistory");
          }}
        >
          History
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel=""
          onClick={() => {
            router.push(`/page/purchasehistory`);
          }}
        >
          Purchase History
        </a>
      ),
    },
    {
      key: "4",
      label: (
        <a target="_blank" rel="" onClick={handleLogout}>
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </a>
      ),
    },
  ];

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center flex-1 justify-center">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (onClick) onClick(searchValue);
            }
          }}
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[30%] md:w-[35%] lg:w-[45%] px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={onClick}
          className="flex items-center justify-center p-[10px] rounded-r-lg border border-gray-300"
          aria-label="Search"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
        </button>
        {/* Upload Video Button */}
        {!isGuest && (
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-all duration-300"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3l4 4h-3v4h-2V7H8l4-4zm0 18c-4.97 0-9-4.03-9-9h2c0 3.86 3.14 7 7 7s7-3.14 7-7h2c0 4.97-4.03 9-9 9z" />
            </svg>
            Upload
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* {!isGuest && <NotificationModel />} */}

        <div className="text-xl cursor-pointer">
          {isGuest ? (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-red-500 bg-white border-2 border-red-500 rounded-lg py-1 px-4 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 cursor-pointer"
              viewBox="0 0 448 512"
              onClick={() => {
                router.push(`/page/detail_user/${userId}`);
              }}
            >
              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
            </svg>
          )}
        </div>

        {isGuest ? (
          ""
        ) : (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div className="text-xl cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 448 512"
              >
                <path d="M16 132h416c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H16C7.2 60 0 67.2 0 76v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16z" />
              </svg>
            </div>
          </Dropdown>
        )}
      </div>

      {/* Modal hiển thị form Upload Video */}
      <Modal
        title="Upload Video"
        visible={isUploadModalOpen}
        footer={null}
        onCancel={() => setIsUploadModalOpen(false)}
        destroyOnClose
      >
        <UploadVideoPost />
      </Modal>
    </header>
  );
};

export default Header;
