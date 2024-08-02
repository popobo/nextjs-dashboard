"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setProgress(percentCompleted);
        },
      });
      alert("File uploaded successfully");
      router.push("/"); // Redirect to home or another page
    } catch (error) {
      console.error("File upload error:", error);
      alert("File upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!file}
      >
        Upload
      </button>
      {progress > 0 && (
        <div className="mt-4 w-64 bg-gray-200 rounded-full">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
