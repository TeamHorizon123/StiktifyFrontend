"use client";

import React, { useState, useEffect, useContext } from "react";
import { notification, Select } from "antd";
import { sendRequestFile, sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

interface ICategory {
  _id: string;
  categoryProductName: string;
}

interface UploadProductProps {
  isEditMode: boolean;
  editingProduct: any;
  onClose: () => void;
  onProductUpdated: () => void;
}

const UploadProduct: React.FC<UploadProductProps> = ({
  isEditMode,
  editingProduct,
  onClose,
  onProductUpdated,
}) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const userId = user?._id || user?.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{
          statusCode: number;
          data: ICategory[];
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-for-products`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.statusCode === 200) {
          setCategories(res.data);
        } else {
          notification.error({ message: "Failed to fetch categories." });
        }
      } catch {
        notification.error({
          message: "An error occurred while retrieving categories.",
        });
      }
    };

    fetchCategories();

    if (isEditMode && editingProduct) {
      setName(editingProduct.productName);
      setDescription(editingProduct.productDescription || "");
      setPrice(editingProduct.productPrice.toString());
      setStock(editingProduct.stock.toString());
      setCategory(editingProduct.productCategory);
    }
  }, [accessToken, isEditMode, editingProduct]);

  const validateInputs = () => {
    if (!name.trim()) {
      notification.error({ message: "Product name is required." });
      return false;
    }
    if (!description.trim()) {
      notification.error({ message: "Product description is required." });
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      notification.error({
        message: "Price is required and must be a positive number.",
      });
      return false;
    }
    if (
      !stock ||
      isNaN(Number(stock)) ||
      Number(stock) < 0 ||
      !Number.isInteger(Number(stock))
    ) {
      notification.error({
        message: "Stock is required and must be a positive number.",
      });
      return false;
    }
    if (!category) {
      notification.error({ message: "Please select a product category." });
      return false;
    }
    if (!isEditMode && !image) {
      notification.error({ message: "Please upload an image." });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleUpload = async () => {
    if (!accessToken) {
      notification.error({
        message: "You are not logged in. Please log in again.",
      });
      return;
    }

    if (!validateInputs()) return;

    setLoading(true);
    try {
      let imageUrl = editingProduct?.image || null;
      if (image) {
        const uploadImageForm = new FormData();
        uploadImageForm.append("file", image);
        uploadImageForm.append("folder", "products");

        const imageUploadRes = await sendRequestFile<{
          statusCode: number;
          data: string;
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadImageForm,
        });

        if (imageUploadRes.statusCode === 201) {
          imageUrl = imageUploadRes.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const productData = {
        userId,
        productName: name,
        productDescription: description,
        productCategory: category,
        productPrice: Number(price),
        stock: Number(stock),
        image: imageUrl,
      };

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`;
      const method = isEditMode ? "PUT" : "POST";

      const postRes = await sendRequest<{
        statusCode: number;
        message: string;
      }>({
        url,
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: productData,
      });

      if (postRes.statusCode === 200 || postRes.statusCode === 201) {
        notification.success({
          message: isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!",
        });
        onProductUpdated();
        onClose();
      } else {
        notification.error({
          message: postRes.message || "Product upload failed.",
        });
      }
    } catch {
      notification.error({ message: "An error occurred during upload." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditMode ? "Edit Product" : ""}</h2>

      <div className="form-field">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          placeholder="Enter description..."
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-input-file"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Category</label>
        <Select
          placeholder="Select Category"
          className="form-select"
          value={category || undefined}
          onChange={setCategory}
        >
          {categories.map((category) => (
            <Select.Option
              key={category._id}
              value={category.categoryProductName}
            >
              {category.categoryProductName}
            </Select.Option>
          ))}
        </Select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`form-button ${
          loading ? "button-disabled" : "button-active"
        }`}
      >
        {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Product"}
      </button>

      <style jsx>{`
        .form-container {
          max-width: 400px; /* Giảm chiều rộng */
          margin: 20px auto; /* Giảm margin */
          background-color: #ffffff;
          padding: 16px; /* Giảm padding */
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          font-size: 18px; /* Giảm kích thước tiêu đề */
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          margin-bottom: 12px; /* Giảm khoảng cách */
        }

        .form-row {
          display: flex;
          gap: 10px; /* Giảm khoảng cách giữa các field */
          margin-bottom: 8px; /* Giảm khoảng cách dưới */
        }

        .form-field {
          margin-bottom: 8px; /* Giảm khoảng cách giữa các trường */
        }

        .form-label {
          display: block;
          font-size: 12px; /* Giảm kích thước font */
          font-weight: 500;
          color: #374151;
          margin-bottom: 2px; /* Giảm khoảng cách với input */
        }

        .form-input,
        .form-textarea,
        .form-input-file {
          width: 100%;
          padding: 6px; /* Giảm padding */
          border: 1px solid #d1d5db;
          border-radius: 4px; /* Giảm bo góc */
          font-size: 12px; /* Giảm kích thước font */
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
          min-height: 40px; /* Giảm chiều cao textarea */
          resize: vertical;
        }

        .form-select {
          width: 100%;
          height: 28px; /* Giảm chiều cao Select */
        }

        .form-button {
          width: 100%;
          padding: 8px; /* Giảm padding */
          border-radius: 4px;
          font-size: 13px; /* Giảm kích thước font */
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

export default UploadProduct;
