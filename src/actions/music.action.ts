"use server";

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetAllMusic = async (current: string, pageSize: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { tags: ["list-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleDisPlayMusicAction = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/display-music/${id}`,
      {
        method: "GET",
        next: { tags: ["display-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};


export const handleUpdateListenerAction = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/update-listener/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result: IBackendRes<any> = await res.json();
    if (result.statusCode === 200) {
      revalidateTag("display-music");
    }
    return result;
  } catch (error) {
    return null;
  }
};
export const handleFilterSearchMusic = async (
  current: string,
  pageSize: string,
  search: string,
  filterRes: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/filter-search?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterRes}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["filter-search-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const createFavoriteMusic = async (musicId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/create-favorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ musicId }),
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetAllFavoriteMusic = async (
  userId: string,
  current: string,
  pageSize: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/list-favorite-music/${userId}?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-favorite-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetMyMusic = async (
  userId: string,
  current: string,
  pageSize: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/my-musics/${userId}?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["get-my-music"] },

      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching user's music:", error);
    return null;
  }
};

export const handleLikeMusicAction = async (id: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/favorite/${id}`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    revalidateTag("display-music");
    return res
  } catch (error) {
    return null
  }
}

export const handleCreateCommentAction = async (musicId: string, newComment: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create-music-comment`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { musicId, CommentDescription: newComment },
    });
    revalidateTag("display-music");
    return res
  } catch (error) {
    return null
  }
}

export const handleCreateMusicAction = async (data: any) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/upload-music`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result: IBackendRes<any> = await res.json();
    if (result.statusCode === 201) {
      revalidateTag("list-music");
    }
    return result;
  } catch (error) {
    return null;
  }
}

export const handleFilterAndSearchMusicAction = async (current: number, pageSize: number, search: string, filterRes: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music-admin?search=${search}&filterReq=${filterRes}&current=${current}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }, next: { tags: ["list-music"] },
    })
    const result: IBackendRes<any> = await res.json();
    return result
  } catch (error) {
    return null
  }
}

export const handleGetMusic = async (current: string, pageSize: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music-admin?current=${current}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      next: { tags: ["list-music"] }
    })
    const result: IBackendRes<any> = await res.json();
    return result
  } catch (error) {
    return null
  }
}

export const handleGetRecommendMusic = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/recommend-music/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-recommend"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleListenNeo4j = async (musicId: string, userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/listen-music-in-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ musicId, userId }),
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};
export const handleGetAllListeningHistory = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/all-listening-history/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["all-listening-history"] },
      }
    );

    return await res.json();
  } catch (error) {
    return null;
  }
};

export const handleClearAllListeningHistory = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/clear-all/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    revalidateTag("all-listening-history")
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const handleSearchHistory = async (search: string, startDate?: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/search-history?search=${search}`;
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["search-history"] },
    });

    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching search history:", error);
    return null;
  }
};


export const getTrackRelatedAction = async (musicId: string[] | [], musicTag: { _id: string, fullname: string }[]) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/track-related`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ musicId, musicTag }),
      }
    );

    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching search history:", error);
    return null;
  }
}

export const handleGetDataHotMusic = async () => {
  try {
    const cookieStore = cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-hot-music`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { tags: ["list-hot-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleDeleteMusic = async (id: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["delete-music"] },
      }
    );
    revalidateTag("get-my-music");
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleUpdateMusic = async (payload: {
  musicId: string;
  musicDescription?: string;
  musicTag?: any[];
  musicThumbnail?: string;
}) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/update-music`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating music:", error);
    return null;
  }
};