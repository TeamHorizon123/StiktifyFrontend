"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetAllCategoryAction = async () => {
    try {
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/list-category`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { tags: ["list-category"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}
