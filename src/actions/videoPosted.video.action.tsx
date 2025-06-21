"use server";

import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const fetchMyVideos = async (
  userId: string,
  current: number,
  pageSize: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/my-videos/${userId}?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return null;
  }
};
