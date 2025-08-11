"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleFollow = async (followerId: string, followingId: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/create-follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          followerId: followerId,
          followingId: followingId,
        }),
      }
    );
    revalidateTag("follow");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch {
    return null;
  }
};

export const checkFollowAction = async (followerId: string, followingId: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/check-follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          followerId: followerId,
          followingId: followingId,
        }),
      }
    );
    revalidateTag("follow");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch {
    return null;
  }
};

export const getAllFollowing = async (followerId: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/list-following/${followerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["follow"] },
      }
    );
    const result: IBackendRes<string[]> = await res.json();
    return result;
  } catch {
    return null;
  }
};
