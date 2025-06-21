

export const separateMusicAction = async (file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_SEPARATE_URL}/separate`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Processing failed");

        return await response.json();
    } catch (error) {
        console.error("Processing error:", error);
        return null;
    }
};


export const lyricMusicAction = async (file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_LYRIC_URL}/process`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Processing failed");

        return await response.json();
    } catch (error) {
        console.error("Processing error:", error);
        return null;
    }
};
