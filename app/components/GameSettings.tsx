"use client";

import React from "react";

type GameSettingsProps = {
  targetScore: number;
  setTargetScore: (score: number) => void;
  vsBot: boolean;
  setVsBot: (vsBot: boolean) => void;
  botDifficulty: "easy" | "medium" | "hard";
  setBotDifficulty: (level: "easy" | "medium" | "hard") => void;
  disabled: boolean;
};

export default function GameSettings({
  targetScore,
  setTargetScore,
  vsBot,
  setVsBot,
  botDifficulty,
  setBotDifficulty,
  disabled,
}: GameSettingsProps) {
  return (
    <div className="px-3 p-2 bg-[#ffffff59] rounded-xl shadow flex flex-col sm:flex-row items-center gap-4">
      {/* Target Score */}
      <div className="flex items-center gap-2">
        <label className="font-medium text-gray-700">🎯 Target Score:</label>
        <select
          value={targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
          disabled={disabled}
          className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-0"
        >
          {[1,50, 100, 150, 200].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Game Mode */}
      <div className="flex items-center gap-2">
        <label className="font-medium text-gray-700">👥 Game Mode:</label>
        <select
          value={vsBot ? "bot" : "2p"}
          onChange={(e) => setVsBot(e.target.value === "bot")}
          disabled={disabled}
          className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-0"
        >
          <option value="2p">2 Players</option>
          <option value="bot">Vs Bot</option>
        </select>
      </div>

      {/* Bot Difficulty */}
      {vsBot && (
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">🤖 Bot:</label>
          <select
            value={botDifficulty}
            onChange={(e) => setBotDifficulty(e.target.value as "easy" | "medium" | "hard")}
            disabled={disabled}
            className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-0"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
    </div>
  );
}
