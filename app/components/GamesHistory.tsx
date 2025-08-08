import { fetchGameHistory, exportAllStats, exportAllGames  } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

  useEffect(() => {
    if (!isOpen) return;
    const loadHistory = async () => {
      const data = await fetchGameHistory();
      setHistory(data);
    };
    loadHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#ffffff] shadow rounded-lg p-6 max-w-xl w-full overflow-y-auto max-h-[90vh] relative"
      >
        <h2 className="text-2xl font-bold mb-4">Game History</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-xl">
          <X />
        </button>
        <ul className="space-y-3 ">
        <button
          onClick={exportAllStats}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 mr-2"
        >
          ดาวน์โหลดสถิติผู้เล่น (JSON)
        </button>
        <button
          onClick={exportAllGames}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          ดาวน์โหลดประวัติเกมส์ (CSV)
        </button>
          {history.map((game) => (
            <li key={game.id} className="bg-gray-100 p-4 rounded">
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
                ({game.player2Score}) — Winner:{" "}
                <span className="text-green-600 font-semibold">
                  {game.winner?.name || "Draw"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Played at: {new Date(game.endTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
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
