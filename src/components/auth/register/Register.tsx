"use client";
import React, { useState } from "react";
import manListeningBg from "@/img/man-listening-bg.png";
import logo from "@/img/logo.png";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/components/auth/ForgotPassword.module.css";
import { sendRequest } from "@/utils/api";
import { notification } from "antd";
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

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      return notification.warning({
        message: "Password must be least 6 characters!",
      });
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      method: "POST",
      body: {
        userName: username,
        password,
        fullname,
        email,
      },
    });
    if (res?.data) {
      router.push(`/verify/${res.data._id}`);
    } else {
      notification.error({
        message: "Registration failed",
        description: res?.message,
        duration: 3,
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
                viewBox="0 0 640 512"
                className="h-[40px] w-[40px] fill-white"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l362.8 0c-5.4-9.4-8.6-20.3-8.6-32l0-128c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7l-91.4 0zM528 240c17.7 0 32 14.3 32 32l0 48-64 0 0-48c0-17.7 14.3-32 32-32zm-80 32l0 48c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
              </svg>
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-white text-center mb-2 ${inteBold.className}`}>
            Create Account
          </h1>

          <p className={`text-gray-400 text-center mb-8 ${interRegular.className}`}>
            Join Stiktify and start your music journey
          </p>

          <form onSubmit={onRegister} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
              >
                Email
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
                  placeholder="stiktify@example.com"
                  className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fullname"
                className={`block text-sm font-medium text-gray-300 mb-3 ${interRegular.className}`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your full name"
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
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
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
              <span>Create Account</span>
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
                onClick={() => router.push("/auth/forgotpassword")}
                className="py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex flex-col items-center gap-2"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Forgot Password</span>
              </button>
            </div>

            {/* <div className="text-center pt-4">
              <p className={`text-gray-400 text-sm ${interRegular.className}`}>
                Already have an account?{" "}
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

export default Register;
