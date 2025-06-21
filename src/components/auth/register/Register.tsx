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
      return notification.warning({ message: "Password must be least 6 characters!" })
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
        message: "Username or password is not correct",
        description: res?.message,
        duration: 3,
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
            Register
          </h2>
          <form onSubmit={onRegister} className="space-y-6 pl-[20px] pr-[20px]">
            <div>
              <label
                htmlFor="email"
                className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="stikify@example.com"
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
              >
                Username:
              </label>
              <input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fullname"
                className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
              >
                Fullname:
              </label>
              <input
                type="fullname"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder=""
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-[16px] font-medium text-midnight-blue ${interRegular.className}`}
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-deep"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-aqua-twilight text-white font-semibold rounded-lg hover:bg-midnight-blue focus:outline-none focus:ring-2 focus:ring-midnight-blue flex items-center"
            >
              <span className="flex-grow text-center ml-5">Register</span>
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
              href="/auth/forgotpassword"
              className="text-aqua-twilight underline"
            >
              Forgot Password
            </a>
          </div>
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

export default Register;
