import { fetchGameHistory, deleteGameById } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { X, Trash } from "lucide-react";
import PlayerProfile from "./PlayerProfile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type GameWithPlayers = {
  id: string;
  player1: { name: string };
  player2: { name: string };
  winner: { name: string } | null;
  player1Score: number;
  player2Score: number;
  endTime: string;
};

export default function HistoryModal({ isOpen, onClose }: Props) {
  const [history, setHistory] = useState<GameWithPlayers[]>([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadHistory = async () => {
      const data = await fetchGameHistory();
      setHistory(data);
    };
    loadHistory();
  }, [isOpen, deletingId]);

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteGameById(deletingId);
      setHistory((prev) => prev.filter((g) => g.id !== deletingId));
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + (err instanceof Error ? err.message : ""));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff94] shadow rounded-lg p-6 max-w-xl w-full overflow-y-auto max-h-[90vh] relative "
      >
        <h2 className="text-2xl font-bold mb-4">Game History</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-xl">
          <X />
        </button>
        <ul className="space-y-3">
          {history.map((game) => (
            <li key={game.id} className="bg-[#ffffff59] p-4 rounded relative">
              <p>
                <strong
                  onClick={() => setSelectedPlayerName(game.player1.name)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {game.player1.name}
                </strong>{" "}
                ({game.player1Score}) vs{" "}
                <strong
                  onClick={() => setSelectedPlayerName(game.player2.name)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {game.player2.name}
                </strong>{" "}
                ({game.player2Score})
                <div className="">
                Winner:{" "}
                <span className="text-green-600 font-semibold">
                  {game.winner?.name || "Draw"}
                </span>
                </div>
              </p>
              <p className="text-sm text-gray-500">
                Played at: {new Date(game.endTime).toLocaleString()}
              </p>
              <button
                onClick={() => confirmDelete(game.id)}
                className="absolute top-6 right-2 text-red-600 hover:text-red-800"
              >
                <Trash />
              </button>
            </li>
          ))}
        </ul>

        {/* Confirm Delete Modal */}
        {deletingId && (
          <>
            <div
              className="fixed inset-0 bg-opacity-50 z-40"
              onClick={cancelDelete}
            />
            <div className="fixed z-50 top-1/2 left-1/2 w-80 p-6 bg-white rounded shadow-lg -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-lg font-semibold mb-4">Confirm game deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete this game? Your data will be permanently lost.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedPlayerName && (
        <PlayerProfile
          playerName={selectedPlayerName}
          onClose={() => setSelectedPlayerName(null)}
        />
      )}
    </div>
  );
}
