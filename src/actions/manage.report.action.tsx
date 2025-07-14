"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;



export const handleDeleteReportVideoAction = async (id: string) => {
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/delete-video-report/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    revalidateTag("list-report-video");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleDeleteReportMusicAction = async (id: string) => {
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/delete-music-report/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    revalidateTag("list-report-music");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleFlagMusicAction = async (id: string, flag: boolean) => {
  if (!token) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/flag-music`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: id,
          flag: flag,
        }),
      }
    );
    revalidateTag("list-report-music");
    revalidateTag("list-music");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetAllReportMusicAction = async (
  current: number, pageSize: number, search: string, filterRes: string
) => {
  try {
    if (!token) return null;
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/v1/report/list-report-music?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterRes}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-report-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error searching music report:", error);
    return null;
  }
};  

export const handleListVideoReportAction = async (
 current: number, pageSize: number, search: string, filterRes: string
) => {
  if (!token) return null;
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/v1/report/list-report-video?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterRes}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-report-video"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error searching video report:", error);
    return null;
  }
};
