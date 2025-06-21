"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notification, Select } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequestFile, sendRequest } from "@/utils/api";

const { Option } = Select;

interface IUploadResponse {
  statusCode: number;
  message: string;
  data?: any;
}

interface ICategory {
  _id: string;
  categoryName: string;
}

interface IMusic {
  _id: string;
  musicDescription?: string;
}

const UploadVideoPost: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const [allMusic, setAllMusic] = useState<IMusic[]>([]);
  const [loading, setLoading] = useState(false);
  const [hashtagsInput, setHashtagsInput] = useState("");

  // useEffect giữ nguyên
  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{ statusCode: number; data: any }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          const categoryData = res.data.map((item: any) => ({
            _id: item._id || "unknown",
            categoryName: item.categoryName || "Unnamed Category",
          }));
          setAllCategories(categoryData);
        } else {
          notification.error({ message: "Failed to fetch categories." });
        }
      } catch (error) {
        notification.error({
          message: "An error occurred while retrieving categories.",
        });
      }
    };
    fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    const fetchMusic = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{ statusCode: number; data: any }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          const musicData = res.data.map((item: any) => ({
            _id: item._id || "unknown",
            musicDescription:
              item.musicDescription ||
              item.name ||
              item.title ||
              "Unnamed Music",
          }));
          setAllMusic(musicData);
        } else {
          notification.error({ message: "Failed to fetch music." });
        }
      } catch (error) {
        notification.error({
          message: "An error occurred while retrieving music.",
        });
      }
    };
    fetchMusic();
  }, [accessToken]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleUpload = async () => {
    if (!accessToken || !user || !user._id || !videoFile || !selectedCategory) {
      notification.error({ message: "Please fill in all required fields." });
      return;
    }
    setLoading(true);
    try {
      const uploadVideoForm = new FormData();
      uploadVideoForm.append("file", videoFile);
      const tagVideoForm = new FormData();
      tagVideoForm.append("file", videoFile);

      const [videoUploadRes, getTagByAIRes] = await Promise.all([
        sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-video`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadVideoForm,
        }),
        sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/get-tag-by-ai`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: tagVideoForm,
        }),
      ]);

      if (videoUploadRes.statusCode !== 201) {
        throw new Error(videoUploadRes.message || "Video upload failed");
      }

      const videoUrl = videoUploadRes.data;
      let thumbnailUrl = "";
      if (videoThumbnail) {
        const uploadThumbnailForm = new FormData();
        uploadThumbnailForm.append("file", videoThumbnail);
        uploadThumbnailForm.append("folder", "thumbnails");
        const thumbnailUploadRes = await sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadThumbnailForm,
        });
        if (thumbnailUploadRes.statusCode === 201) {
          thumbnailUrl = thumbnailUploadRes.data;
        }
      }

      const videoInputTag = hashtagsInput
        .split(" ")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const videoTag = [...new Set([...videoInputTag, ...getTagByAIRes.data])];
      const postData = {
        videoDescription,
        videoUrl,
        videoThumbnail: thumbnailUrl,
        userId: user._id,
        videoTag,
        categories: [selectedCategory],
        musicId: selectedMusic || undefined,
      };

      const postRes = await sendRequest<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/create`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: postData,
      });

      if (postRes.statusCode === 201) {
        notification.success({ message: "Post created successfully!" });
        setVideoDescription("");
        setVideoFile(null);
        setVideoThumbnail(null);
        setSelectedCategory("");
        setSelectedMusic("");
        setHashtagsInput("");
        router.push(`/page/detail_user/${user._id}`);
      } else {
        notification.error({
          message: postRes.message || "Post creation failed.",
        });
      }
    } catch (error) {
      notification.error({
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed-form-container">
      <div className="upload-form">
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, setVideoFile)}
              className="form-input-file"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setVideoThumbnail)}
              className="form-input-file"
            />
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label">Description</label>
          <textarea
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="form-textarea"
            placeholder="Enter description..."
          />
        </div>

        <div className="form-field full-width">
          <label className="form-label">Hashtags</label>
          <input
            type="text"
            value={hashtagsInput}
            onChange={(e) => setHashtagsInput(e.target.value)}
            className="form-input"
            placeholder="#fun #travel #music"
          />
        </div>

        <div className="form-row">
          <div className="form-field category-field">
            <label className="form-label">Category</label>
            <Select
              placeholder="Select category"
              className="form-select"
              value={selectedCategory || undefined}
              onChange={(value) => setSelectedCategory(value)}
            >
              {allCategories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="form-field music-field">
            <label className="form-label">Music</label>
            <Select
              showSearch
              placeholder="Select music"
              className="form-select"
              value={selectedMusic || undefined}
              onChange={(value) => setSelectedMusic(value)}
              filterOption={(input, option) => {
                const musicDescription =
                  (option?.children as unknown as string) || "Unnamed Music";
                const searchInput = input;

                // Hàm chuẩn hóa chuỗi để loại bỏ dấu
                const removeDiacritics = (str: string) =>
                  str
                    .normalize("NFD") // Phân tách ký tự và dấu
                    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
                    .toLowerCase();

                const normalizedMusicDescription =
                  removeDiacritics(musicDescription);
                const normalizedSearchInput = removeDiacritics(searchInput);

                // Nếu searchInput khớp hoàn toàn với musicDescription, chỉ hiển thị music đó
                if (normalizedMusicDescription === normalizedSearchInput) {
                  return true;
                }

                // Nếu không khớp hoàn toàn, tìm kiếm theo startsWith
                return normalizedMusicDescription.startsWith(
                  normalizedSearchInput
                );
              }}
              filterSort={(optionA, optionB) =>
                ((optionA?.children as unknown as string) || "")
                  .toLowerCase()
                  .localeCompare(
                    (
                      (optionB?.children as unknown as string) || ""
                    ).toLowerCase()
                  )
              }
            >
              {allMusic.map((music) => (
                <Option key={music._id} value={music._id}>
                  {music.musicDescription || "Unnamed Music"}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`form-button ${
            loading ? "button-disabled" : "button-active"
          }`}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      <style jsx>{`
        .fixed-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: auto;
          max-height: 500px;
          background-color: #f0f2f5;
          padding: 16px;
        }

        .upload-form {
          width: 720px;
          background-color: #ffffff;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-row {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }

        .form-field {
          min-width: 0;
        }

        .form-field.full-width {
          flex: none;
          width: 100%;
          margin-bottom: 8px;
        }

        .form-field.category-field {
          flex: 1; /* Category chiếm ít không gian hơn */
        }

        .form-field.music-field {
          flex: 2; /* Music chiếm nhiều không gian hơn */
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 3px;
        }

        .form-input,
        .form-textarea,
        .form-input-file {
          width: 100%;
          padding: 6px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 12px;
          color: #1f2937;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-input-file:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .form-textarea {
          min-height: 50px;
          resize: vertical;
        }

        .form-select {
          width: 100%;
          height: 30px;
        }

        .form-button {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          transition: background-color 0.2s ease;
        }

        .button-active {
          background-color: #3b82f6;
        }

        .button-active:hover {
          background-color: #2563eb;
        }

        .button-disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default UploadVideoPost;
