"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;


export const handleFlagShortVideoAction = async (id: string, flag: boolean) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/flag-video`,
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
    revalidateTag("list-short-video");
    revalidateTag("list-report");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetAllShortVideo = async (
  searchText: string,
  filterReq: string,
  current: number,
  pageSize: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/v1/short-videos/list-video?search=${encodeURIComponent(
        searchText
      )}&filterReq=${encodeURIComponent(
        filterReq
      )}&current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-short-video"] },
      }
    );
    const result = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleFilterByCategory = async (
  category: string,
  current: number,
  pageSize: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/filter-by-category?category=${encodeURIComponent(category)}&current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token có sẵn trong cookie
        },
        next: { tags: ["filter-by-category"] }, // Thêm revalidation nếu cần
      }
    );

    const result: IBackendRes<any> = await res.json();
    return result; // Trả về kết quả
  } catch (error) {
    console.error("Lỗi khi gọi API lọc theo thể loại:", error);
    return null;
  }
};
