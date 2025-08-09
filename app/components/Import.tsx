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
      setMessage("Is this a .json file?");
      return;
    }

    try {
      setLoading(true);
      const result = await importFullData(file);
      setMessage(`✅ Successfully imported: ${JSON.stringify(result.count)}`);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
      setMessage("❌ An error occurred during import");
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
    <div
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">import data (.json)</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center hover:bg-gray-50 transition"
        >
          <p className="mb-2">Drag and drop the JSON file here.</p>
          <p className="text-sm text-gray-500">or</p>
          <label className="mt-2 inline-block cursor-pointer text-blue-600 underline">
            Select file from device
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>

          {fileName && <p className="mt-4 text-green-600">file: {fileName}</p>}
          {loading && <p className="text-yellow-600 mt-2">Importing...</p>}
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}
