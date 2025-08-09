import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchPlayerStatistics, fetchPlayerGameHistory } from "@/utils/api";

type Props = {
  playerName: string;
  onClose: () => void;
};

type PlayerStatistics = {
  totalGames: number;
  wins: number;
  losses: number;
  winPercentage: number;
  avgScorePerGame: number;
  maxScore: number;
  avgGameDuration: number;
  totalRollsOf1: number;
};

type Game = {
  id: string;
  player1: { name: string };
  player2: { name: string };
  winner: { name: string } | null;
  player1Score: number;
  player2Score: number;
  endTime: string;
};

export default function PlayerProfileModal({ playerName, onClose }: Props) {
  const [stats, setStats] = useState<PlayerStatistics | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const statsData = await fetchPlayerStatistics(playerName);
      const gameData = await fetchPlayerGameHistory(playerName);
      setStats(statsData);
      setGames(gameData);
    };
    loadData();
  }, [playerName]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 max-w-2xl w-full overflow-y-auto max-h-[90vh] relative"
      >
        <button onClick={onClose} className="absolute top-4 right-6 text-xl">
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4">{`${playerName}'s Profile`}</h2>

        {stats ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Statistics</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Total Games: {stats.totalGames}</li>
              <li>Wins: {stats.wins}</li>
              <li>Losses: {stats.losses}</li>
              <li>Win Percentage: {stats.winPercentage.toFixed(2)}%</li>
              <li>
                Average Score per Game: {stats.avgScorePerGame.toFixed(2)}
              </li>
              <li>Max Score: {stats.maxScore}</li>
              <li>
                Average Game Duration: {stats.avgGameDuration.toFixed(2)} sec
              </li>
              <li>Total Rolls of 1: {stats.totalRollsOf1}</li>
            </ul>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Game History</h3>
          <ul className="space-y-3">
            {games.map((game) => (
              <li key={game.id} className="bg-gray-100 p-3 rounded">
                <p>
                  {game.player1.name} ({game.player1Score}) vs{" "}
                  {game.player2.name} ({game.player2Score}) — Winner:{" "}
                  <strong>{game.winner?.name || "Draw"}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Played at: {new Date(game.endTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
