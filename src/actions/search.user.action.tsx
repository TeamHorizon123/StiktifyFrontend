"use server";

import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const handleSearchUserAndVideo = async (
  searchText: string,
  current: number = 1,
  pageSize: number = 10
) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/search-user-video?searchText=${searchText}&current=${current}&pageSize=${pageSize}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { users: [], videos: [] };
    }
    const result: IBackendRes<any> = await res.json();
    return result.data;
  } catch (error) {
    return { users: [], videos: [] };
  }
};
