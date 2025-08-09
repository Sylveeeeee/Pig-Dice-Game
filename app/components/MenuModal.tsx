"use client";

import { useState } from "react";
import { History, FileUp, Download, FileDown, X } from "lucide-react";
import GamesHistory from "./GamesHistory";
import Import from "./Import";
import { exportAllStats, exportAllGames, backupNow, resetAllData } from "@/utils/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuModal({ isOpen, onClose }: Props) {
  const [showHistory, setShowHistory] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleResetAllData = async () => {
    const confirmReset = confirm(
      "⚠️Are you sure you want to reset all data? All data will be lost!"
    );
    if (!confirmReset) return;

    try {
      setStatus("Backing up data...");
      await backupNow();

      setStatus("Resetting data...");
      const result = await resetAllData();

      setStatus(`✅ ${result.message}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "unknown cause";
      setStatus(`❌ An error occurred.: ${errMsg}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed bg-[#0000009f] backdrop-blur-xs inset-0 bg-opacity-50 flex items-center justify-center z-50"
    >
      
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff94] rounded-lg shadow-lg p-6 w-full max-w-md relative space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">management menu</h2>

        {/* History */}
        <button
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
          onClick={() => setShowHistory(true)}
        >
          <History /> Playing history
        </button>
        <GamesHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />

        {/* Export JSON */}
        <button
          onClick={exportAllStats}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <FileUp /> Export statistics (JSON)
        </button>

        {/* Export CSV */}
        <button
          onClick={exportAllGames}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <Download /> Export history (CSV)
        </button>

        {/* Import */}
        <button
          onClick={() => setShowImport(true)}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <FileDown /> import data
        </button>
        <Import isOpen={showImport} onClose={() => setShowImport(false)} />

        {/* Backup now */}
        <button
          onClick={async () => {
            const result = await backupNow();
            alert("✅ Successful backup: " + result.file);
          }}
          className="bg-[#37d63f] text-white px-4 py-2 rounded w-full hover:bg-[#2ebf32] "
        >
          Back up now
        </button>

        {/* Reset all */}
        <button
          onClick={handleResetAllData}
          className="bg-[#ff4444] text-white px-4 py-2 rounded w-full hover:bg-[#b12e2e] transition-colors"
        >
          Reset all data
        </button>

        {status && (
          <p
            className={`mt-2 text-sm ${status.startsWith("✅")
                ? "text-green-600"
                : status.startsWith("❌")
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
