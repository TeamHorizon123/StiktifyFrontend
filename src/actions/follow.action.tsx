"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const handleGetFollowing = async (current: number, userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/list-video-following/${userId}?pageSize=10&current=${current}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-follow"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetFollowingUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/following/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-follow"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetFollowerUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/followers/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-follow"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};
