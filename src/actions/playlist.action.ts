"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetPlaylistAction = async (id: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/list-playlist/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                next: { tags: ["list-playlist"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}


export const handleGetDetailsPlaylistAction = async (id: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/detail-playlist/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                next: { tags: ["list-playlist"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleAddMusicInPlaylistAction = async (playlistId: string, musicId: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/store-playlist/create-store-playlist`,
            {
                method: "POST",
                body: JSON.stringify({ playlistId, musicId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
        const result: IBackendRes<any> = await res.json();
        revalidateTag("list-music-playlist")
        return result
    } catch (error) {
        return null
    }
}

export const handleAddPlaylistAction = async (userId: string, name: string, description: string, image: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/add-playlist`,
            {
                method: "POST",
                body: JSON.stringify({ userId: userId, name: name, description: description, image: image }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
        const result: IBackendRes<any> = await res.json();
        revalidateTag("list-playlist")
        return result
    } catch (error) {
        return null
    }
}

export const handleGetMusicInPlaylistAction = async (playlistId: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/store-playlist/list-music-playlist/${playlistId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                next: { tags: ["list-music-playlist"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleRemoveMusicInPlaylistAction = async (musicId: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/store-playlist/delete-music-playlist/${musicId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
        revalidateTag("list-music-playlist")

        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleFilterSearchPlaylist = async (current: string, pageSize: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/store-playlist/filter-search?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["filter-search-playlist"] }
        });
        const result: IBackendRes<any> = await res.json();
        return result;
    } catch (error) {
        return null;
    }
};


export const handleDeletePlaylist = async (id: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/delete-playlist/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const result: IBackendRes<any> = await res.json();
        revalidateTag("list-playlist")
        return result;
    } catch (error) {
        return null;
    }
};