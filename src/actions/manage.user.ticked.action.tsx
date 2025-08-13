"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetAllUserTickedAction = async (
  current: number,
  pageSize: number
) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/list-ticked?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-ticked"] },
      }
    );
    const result = await res.json();
    return result;
  } catch {
    return null;
  }
};

// Action để đồng ý yêu cầu
export const handleAcceptUserTickedAction = async (id: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/${id}/approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to accept the request");

    revalidateTag("list-ticked");
    return { success: true, message: "Request accepted successfully!" };
  } catch {
    return { success: false, message: "Failed to accept the request" };
  }
};

// Action để từ chối yêu cầu
export const handleDenyUserTickedAction = async (
  id: string,
  reason: string
) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/${id}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!res.ok) throw new Error("Failed to deny the request");

    revalidateTag("list-ticked");
    return { success: true, message: "Request denied successfully!" };
  } catch {
    return { success: false, message: "Failed to deny the request" };
  }
};

export const handleFilterAndSearchUserRequest = async (
  current: number,
  pageSize: number,
  search: string,
  filterReq: string
) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticked-users/filter-search?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterReq}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-ticked"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu đã lọc:", error);
    return null;
  }
};
