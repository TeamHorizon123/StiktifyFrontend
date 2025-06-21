"use client";
import React, { useState } from "react";
import manListeningBg from "@/img/man-listening-bg.png";
import logo from "@/img/logo.png";
import Image from "next/image";
import { Inter } from "next/font/google";
import { notification, Steps } from "antd";
import styles from "@/components/auth/ForgotPassword.module.css";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const inteBold = Inter({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const interRegular = Inter({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [current, setCurrent] = useState(0);

  const onFinishStep0 = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setEmail(res?.data?.email);
      setCurrent(1);
    } else {
      setEmail("");
      notification.error({
        message: "Account does not exist",
        description: res?.message,
        duration: 3,
      });
    }
  };
  const onFinishStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password.length<6){
      notification.error({
        message: "Invalid Input",
        description: "Password must have at least 6 characters!",
      });
    }
    if(confirmPassword.length<6){
      notification.error({
        message: "Invalid Input",
        description: "ConfirmPassword must have at least 6 characters!",
      });
    }
    if (password !== confirmPassword) {
      notification.error({
        message: "Invalid Input",
        description: "Password and confirmation password do not match!",
      });
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
      method: "POST",
      body: {
        activeCode: code,
        password,
        confirmPassword,
        userName: email,
      },
    });
    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "The verification code entered is incorrect or expired.",
        description: res?.message,
      });
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-custom-gradient">
      {/* Form Container */}
      <div className="w-full max-w-[480px] bg-white shadow-md rounded-lg overflow-hidden absolute left-0 top-0 bottom-0 z-10">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              className="h-[90px] w-[90px]"
              fill="var(midnight-blue)"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l362.8 0c-5.4-9.4-8.6-20.3-8.6-32l0-128c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7l-91.4 0zM528 240c17.7 0 32 14.3 32 32l0 48-64 0 0-48c0-17.7 14.3-32 32-32zm-80 32l0 48c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
            </svg>
          </div>

          <h2
            className={`text-2xl font-bold text-midnight-blue text-center mb-5 ${inteBold.className}`}
          >
            Forgot Password
          </h2>
          <Steps
            current={current}
            items={[
              {
                title: "Email",
                icon: <UserOutlined />,
                description: "Step 1",
              },
              {
                title: "Verification",
                icon: <SolutionOutlined />,
                description: "Step 2",
              },
              {
                title: "Done",
                icon: <SmileOutlined />,
                description: "Step 3",
              },
            ]}
          />

          {current === 0 && (
            <>
              <p
                className={`text-[16px] pl-[20px] pr-[20px] text-midnight-blue text-center mb-6 mt-[40px] ${interRegular.className}`}
              >
                Enter the email address associated with your account, and we’ll
                send you instructions to reset your password.
              </p>
              <form
                onSubmit={onFinishStep0}
                className="space-y-6 pl-[20px] pr-[20px]"
              >
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
                  >
                    Email Address:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-aqua-twilight text-white font-semibold rounded-lg hover:bg-midnight-blue focus:outline-none focus:ring-2 focus:ring-midnight-blue flex items-center"
                >
                  <span className="flex-grow text-center ml-5">Send Code</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-5 w-5 fill-current text-white group-hover:text-midnight-blue transition-colors duration-300 mr-5"
                  >
                    <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                  </svg>
                </button>
              </form>
              <div className="flex justify-center space-x-4 mt-[30px]">
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  <Image
                    src={logo}
                    alt="Logo"
                    className="object-cover w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-aqua-twilight">Stiktify</span>
                <a href="/auth/login" className="text-aqua-twilight underline">
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="text-aqua-twilight underline"
                >
                  Register
                </a>
              </div>
            </>
          )}

          {current === 1 && (
            <>
              <p
                className={`text-[16px] pl-[20px] pr-[20px] text-midnight-blue text-center mt-[10px] mb-[10px] ${interRegular.className}`}
              >
                Please check your email:{" "}
                <p className="text-aqua-twilight">{email}</p> And Enter the code
                we sent you in the field below.
              </p>
              <form
                onSubmit={onFinishStep1}
                className="space-y-[10px] pl-[20px] pr-[20px]"
              >
                <div>
                  <label
                    htmlFor="text"
                    className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
                  >
                    Verification code:{" "}
                    <span className="text-aqua-twilight ml-[10px]">
                      The code is valid for 5 minutes.
                    </span>
                  </label>
                  <input
                    type="text"
                    id="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Verification Code"
                    className="mt-[2px] block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
                  >
                    Reset Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Reset Password"
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                    required
                  />
                </div>{" "}
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
                  >
                    Confirmed Password:
                  </label>
                  <input
                    type="password"
                    id="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter Confirmed Password"
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrent(0)}
                    className="py-3 px-6 bg-gray-300 text-midnight-blue font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-midnight-blue flex items-center"
                  >
                    Step 1
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-3 bg-aqua-twilight text-white font-semibold rounded-lg hover:bg-midnight-blue focus:outline-none focus:ring-2 focus:ring-midnight-blue flex items-center"
                  >
                    <span className="flex-grow text-center">Submit</span>
                  </button>
                </div>
              </form>
            </>
          )}
          {current === 2 && (
            <>
              <p
                className={`text-[16px] pl-[20px] pr-[20px] text-aqua-twilight text-center mt-[30px] mb-[10px] ${interRegular.className}`}
              >
                Your account password has been successfully changed. Please
                login again.
              </p>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="200"
                  height="200"
                >
                  <path
                    fill="#0C6478"
                    d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM227.3 387.3l184-184c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6 0L216 308.1l-70.1-70.1c-6.2-6.2-16.4-6.2-22.6 0l-22.6 22.6c-6.2-6.2-6.2 16.4 0 22.6l104 104c6.2 6.2 16.4 6.2 22.6 0z"
                  />
                </svg>
              </div>
              <div className="flex justify-center space-x-4 mt-[30px]">
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  <Image
                    src={logo}
                    alt="Logo"
                    className="object-cover w-[30px] h-[30px]"
                  />
                </div>
                <span className="text-aqua-twilight">Stiktify</span>
                <a href="/auth/login" className="text-aqua-twilight underline">
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="text-aqua-twilight underline"
                >
                  Register
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <svg
          className={`${styles.audiogram} col absolute right-[24vw] top-[30vh]`}
          xmlns="http://www.w3.org/2000/svg"
          height="200"
          width="570"
        >
          <defs>
            <linearGradient
              id="audiogram-background"
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="1"
            >
              <stop offset="0%" stopColor="#15919B" />
              <stop offset="31.33%" stopColor="#0C6478" />
              <stop offset="94%" stopColor="#09D1C7" />
            </linearGradient>
          </defs>
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="26.3"
            x="0"
            y="87.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="51.9"
            x="20"
            y="75.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="102.2"
            x="40"
            y="49.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="135.0"
            x="60"
            y="33.5"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="164.2"
            x="80"
            y="18.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="186.6"
            x="100"
            y="7.7"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="199.6"
            x="120"
            y="1.2"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="202.0"
            x="140"
            y="0.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="193.4"
            x="160"
            y="4.3"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="174.7"
            x="180"
            y="13.7"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="148.0"
            x="200"
            y="27.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="116.3"
            x="220"
            y="42.8"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="83.1"
            x="240"
            y="59.5"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="51.9"
            x="260"
            y="75.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="26.3"
            x="280"
            y="87.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="102.2"
            x="520"
            y="49.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="135.0"
            x="500"
            y="33.5"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="164.2"
            x="480"
            y="18.9"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="186.6"
            x="460"
            y="7.7"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="199.6"
            x="440"
            y="1.2"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="202.0"
            x="420"
            y="0.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="193.4"
            x="400"
            y="4.3"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="174.7"
            x="380"
            y="13.7"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="148.0"
            x="360"
            y="27.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="116.3"
            x="340"
            y="42.8"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="83.1"
            x="320"
            y="59.5"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="51.9"
            x="300"
            y="75.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="51.9"
            x="540"
            y="75.0"
            rx="5"
            ry="5"
          />
          <rect
            width="10"
            className={styles.audioBar}
            fill="url(#audiogram-background)"
            height="26.3"
            x="560"
            y="87.9"
            rx="5"
            ry="5"
          />
        </svg>
      </div>
      {/* Background Image */}
      <div className="absolute right-0 top-0 bottom-0">
        <Image
          src={manListeningBg}
          alt="Man listening"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
