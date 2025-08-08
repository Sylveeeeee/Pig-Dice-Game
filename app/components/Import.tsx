"use client";

import React, { useState, DragEvent } from "react";
import { importFullData } from "@/utils/api";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".json")) {
      setMessage("กรุณาเลือกไฟล์ .json เท่านั้น");
      return;
    }

    try {
      setLoading(true);
      const result = await importFullData(file);
      setMessage(`✅ นำเข้าสำเร็จ: ${JSON.stringify(result.count)}`);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
      setMessage("❌ เกิดข้อผิดพลาดระหว่างนำเข้า");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">นำเข้าข้อมูล (.json)</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center hover:bg-gray-50 transition"
        >
          <p className="mb-2">ลากไฟล์ JSON มาวางที่นี่</p>
          <p className="text-sm text-gray-500">หรือ</p>
          <label className="mt-2 inline-block cursor-pointer text-blue-600 underline">
            เลือกไฟล์จากเครื่อง
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>

          {fileName && <p className="mt-4 text-green-600">ไฟล์: {fileName}</p>}
          {loading && <p className="text-yellow-600 mt-2">กำลังนำเข้า...</p>}
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}
