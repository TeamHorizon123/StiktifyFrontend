"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const handleGetAllProducts = async (
  current: number,
  pageSize: number,
  query: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/list-product`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-products"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const handleGetProductDetails = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/product-details/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          next: { tags: ["product-details"] },
        }
      );
      if (!res.ok) {
        throw new Error('Product not found or failed to fetch');
      }
      const result: IBackendRes<any> = await res.json();
      return result;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  export const handleSearchProducts = async (
    query: string,
    current: number,
    pageSize: number
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/search-product?query=${query}&current=${current}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          next: { tags: ["search-products"] },
        }
      );
      const result: IBackendRes<any> = await res.json();
      return result;
    } catch (error) {
      console.error("Error searching products:", error);
      return null;
    }
  };
  