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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
    if (password.length < 6) {
      notification.error({
        message: "Invalid Input",
        description: "Password must have at least 6 characters!",
      });
    }
    if (confirmPassword.length < 6) {
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
    <div className="relative min-h-screen flex items-center justify-center main-layout">
      {/* Form Container */}
      <div className="w-full max-w-[480px] bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden absolute left-0 top-0 bottom-0 z-10 border border-gray-700 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-[40px] w-[40px] fill-white"
              >
                <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
              </svg>
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-white text-center mb-2 ${inteBold.className}`}>
            Reset Password
          </h1>

          <p className={`text-gray-400 text-center mb-8 ${interRegular.className}`}>
            Don't worry, we'll help you get back in
          </p>

          {/* Custom Steps Component with Dark Theme */}
          <div className="mb-8">
            <Steps
              current={current}
              items={[
                {
                  title: <span className="text-gray-300">Email</span>,
                  icon: <UserOutlined className="text-purple" />,
                  description: <span className="text-gray-400">Step 1</span>,
                },
                {
                  title: <span className="text-gray-300">Verification</span>,
                  icon: <SolutionOutlined className="text-purple" />,
                  description: <span className="text-gray-400">Step 2</span>,
                },
                {
                  title: <span className="text-gray-300">Done</span>,
                  icon: <SmileOutlined className="text-purple" />,
                  description: <span className="text-gray-400">Step 3</span>,
                },
              ]}
              className="custom-steps"
            />
          </div>

          {current === 0 && (
            <form onSubmit={onFinishStep0} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                </svg>
                <span>Send Reset Code</span>
              </button>

              <div className="text-center">
                <p className={`text-gray-400 text-sm mb-6 ${interRegular.className}`}>
                  or continue with
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/page/trending")}
                  className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="text-xs">Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-xs">Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/register")}
                  className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <span className="text-xs">Register</span>
                </button>
              </div>

              {/* <div className="text-center pt-4">
                <p className={`text-gray-400 text-sm ${interRegular.className}`}>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="text-purple-400 hover:text-purple-300 underline transition-colors"
                  >
                    Sign in now
                  </button>
                </p>
              </div> */}
            </form>
          )}

          {current === 1 && (
            <form onSubmit={onFinishStep1} className="space-y-6">
              <div className={`text-sm text-gray-300 text-center mb-6 ${interRegular.className}`}>
                <p>Please check your email:</p>
                <p className="text-purple-400 font-medium mt-1">{email}</p>
                <p className="mt-2">And enter the code we sent you below.</p>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
                >
                  Verification Code
                  <span className="text-purple-400 text-xs ml-2">
                    (Valid for 5 minutes)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrent(0)}
                  className="py-3 px-6 bg-gray-600/80 text-white font-semibold rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 border border-gray-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>Reset Password</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {current === 2 && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-10 h-10 fill-purple-400"
                  >
                    <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM227.3 387.3l184-184c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6 0L216 308.1l-70.1-70.1c-6.2-6.2-16.4-6.2-22.6 0l-22.6 22.6c-6.2 6.2-6.2 16.4 0 22.6l104 104c6.2 6.2 16.4 6.2 22.6 0z" />
                  </svg>
                </div>
              </div>
              <h3 className={`text-xl font-bold text-white mb-3 ${inteBold.className}`}>
                Password Reset Successful!
              </h3>
              <p className={`text-gray-400 mb-6 ${interRegular.className}`}>
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <span>Continue to Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Fixed bottom navigation */}
        {/* <div className="border-t border-gray-700 p-4 bg-gray-800/95">
          <div className="flex justify-center items-center space-x-3 text-sm">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/30">
              <Image
                src={logo}
                alt="Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <button
              onClick={() => router.push("/page/trending")}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Stiktify
            </button>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200 hover:bg-purple-900/20 px-2 py-1 rounded"
            >
              Login
            </button>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => router.push("/auth/register")}
              className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200 hover:bg-purple-900/20 px-2 py-1 rounded"
            >
              Register
            </button>
          </div>
        </div> */}
      </div>

      {/* Audio Animation */}
      <div>
        <svg
          className={`${styles.audiogram} absolute right-[24vw] top-[30vh]`}
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
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="30%" stopColor="#9333ea" />
              <stop offset="70%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#581c87" />
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

      {/* Background Image with overlay */}
      <div className="absolute right-0 top-0 bottom-0">
        <div className="relative h-full">
          <Image
            src={manListeningBg}
            alt="Man listening"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 "></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
