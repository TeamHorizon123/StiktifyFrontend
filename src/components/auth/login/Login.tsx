"use client";
import React, { useContext, useState } from "react";
import manListeningBg from "@/img/man-listening-bg.png";
import logo from "@/img/logo.png";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/components/auth/ForgotPassword.module.css";
import { sendRequest } from "@/utils/api";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

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

const Login = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext) ?? {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [code, setCode] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const onLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (password.length < 6) {
        return notification.warning({
          message: "Password must be least 6 characters!",
        });
      }
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        method: "POST",
        body: {
          username: email,
          password,
        },
      });

      if (res?.data?.access_token) {
        login?.(res?.data?.access_token);
      }

      if (res?.data?.user?.role == "ADMIN") {
        router.push("/dashboard/user");
      } else if (res?.data?.user?.role == "USERS") {
        router.push("/page/trending");
      } else {
        if (res?.message === "Account has not been activated") {
          setIsActive(false);
          const res2 = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
              email: email,
            },
          });
          setUserId(res2.data._id);
        }
        notification.error({
          message: "Login Unsuccessfully",
          description: res?.message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server can't connect",
        duration: 3,
      });
    }
  };

  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        _id: userId,
        activeCode: code,
      },
    });
    if (res.statusCode != 400) {
      notification.success({
        message: "Retry Active Account Successfully",
        description: res?.message,
        duration: 3,
      });
      setCode("");
      setIsActive(true);
    } else {
      notification.error({
        message: "Retry Active Account Failure",
        description: res?.message,
        duration: 3,
      });
      setCode("");
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
                viewBox="0 0 24 24"
                className="h-[40px] w-[40px] fill-white"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <h1
            className={`text-3xl font-bold text-white text-center mb-2 ${inteBold.className}`}
          >
            Welcome Back
          </h1>

          <p
            className={`text-gray-400 text-center mb-8 ${interRegular.className}`}
          >
            Sign in to your Stiktify account
          </p>

          {isActive ? (
            <form onSubmit={onLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
                >
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="stiktify@example.com"
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
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                <span>Sign In</span>
              </button>

              <div className="text-center">
                <p
                  className={`text-gray-400 text-sm mb-6 ${interRegular.className}`}
                >
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
                  onClick={() => router.push("/auth/register")}
                  className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <span className="text-xs">Register</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/forgotpassword")}
                  className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs">Forgot Password</span>
                </button>
              </div>

              {/* <div className="text-center pt-4">
                <p
                  className={`text-gray-400 text-sm ${interRegular.className}`}
                >
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/register")}
                    className="text-purple-400 hover:text-purple-300 underline transition-colors"
                  >
                    Create one now
                  </button>
                </p>
              </div> */}
            </form>
          ) : (
            <div>
              <p
                className={`text-sm text-gray-300 text-center mb-6 ${interRegular.className}`}
              >
                Please check your email:{" "}
                <span className="text-purple-400 font-medium">{email}</span> And
                enter the code we sent you in the field below to activate your
                account.
              </p>
              <form onSubmit={handleCheckCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="text"
                    className={`block text-sm font-medium text-gray-300 mb-2 ${interRegular.className}`}
                  >
                    Verification code:{" "}
                    <span className="text-purple-400 text-xs">
                      The code is valid for 5 minutes.
                    </span>
                  </label>
                  <input
                    type="text"
                    id="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Verification Code"
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
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
          <div className="absolute inset-0 bg-gradient-to-l from-purple-900/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
