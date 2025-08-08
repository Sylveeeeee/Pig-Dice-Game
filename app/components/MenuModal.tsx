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

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">เมนูจัดการข้อมูล</h2>

        {/* History */}
        <button
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
          onClick={() => setShowHistory(true)}
        >
          <History /> ประวัติการเล่น
        </button>
        <GamesHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />

        {/* Export JSON */}
        <button
          onClick={exportAllStats}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <FileUp /> ส่งออกสถิติ (JSON)
        </button>

        {/* Export CSV */}
        <button
          onClick={exportAllGames}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <Download /> ส่งออกประวัติ (CSV)
        </button>

        {/* Import */}
        <button
          onClick={() => setShowImport(true)}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79] w-full"
        >
          <FileDown /> นำเข้าข้อมูล
        </button>
        <Import isOpen={showImport} onClose={() => setShowImport(false)} />

        {/* Backup now */}
        <button
          onClick={async () => {
            const result = await backupNow();
            alert("✅ สำรองข้อมูลสำเร็จ: " + result.file);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          สำรองข้อมูลตอนนี้
        </button>

        {/* Reset all */}
        <button
          onClick={async () => {
            const confirmReset = confirm(
              "⚠️ คุณแน่ใจหรือไม่ว่าต้องการรีเซตข้อมูลทั้งหมด? ข้อมูลจะหายทั้งหมด!"
            );
            if (!confirmReset) return;

            try {
              await backupNow();
              const result = await resetAllData();
              alert(result.message);
            } catch (err: unknown) {
              alert("เกิดข้อผิดพลาด: " + (err as Error).message);
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700"
        >
          รีเซตข้อมูลทั้งหมด
        </button>
      </div>
    </div>
  );
}
