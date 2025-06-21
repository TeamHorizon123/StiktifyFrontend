"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { sendRequest } from "@/utils/api";
import Cookies from "js-cookie";
interface AuthContextType {
  accessToken: string | null;
  user: any;
  login: (token: string) => void;
  logout: () => void;
  listFollow: string[];
  setListFollow?: (v: any) => void;
  flag: boolean;
  setFlag: (v: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [listFollow, setListFollow] = useState<string[] | []>([]);
  const [flag, setFlag] = useState<any>(false);

  const login = (token: string) => {
    setAccessToken(token);
    Cookies.set("token", token, { expires: 365 });
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    Cookies.remove("token");
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/getUser`,
          method: "POST",
          body: {
            token: accessToken,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error in get user:", error);
        logout();
      }
    };

    fetchUser();
  }, [accessToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        listFollow,
        setListFollow,
        flag,
        setFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
