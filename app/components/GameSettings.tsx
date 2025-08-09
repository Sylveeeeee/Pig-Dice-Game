"use client";

import React from "react";
import { Target,Users,Bot   } from 'lucide-react';

type GameSettingsProps = {
  targetScore: number;
  setTargetScore: (score: number) => void;
  vsBot: boolean;
  setVsBot: (vsBot: boolean) => void;
  botDifficulty: "easy" | "medium" | "hard";
  setBotDifficulty: (level: "easy" | "medium" | "hard") => void;
  disabled: boolean;
  onBotNameChange: (name: string) => void;
};

export default function GameSettings({
  targetScore,
  setTargetScore,
  vsBot,
  setVsBot,
  botDifficulty,
  setBotDifficulty,
  disabled,
  onBotNameChange
}: GameSettingsProps) {
  return (
    <div className="px-3 p-2 bg-[#ffffff59] rounded-xl shadow flex  flex-row  md:items-center gap-4">
      {/* Target Score */}
      <div className="flex items-center gap-2">
        <Target  />
        <label className="font-medium text-gray-700 md:block hidden">Target Score:</label>
        <select
          value={targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
          disabled={disabled}
          className="border rounded text-sm focus:outline-none focus:ring-0 "
        >
          {[1, 50, 100, 150, 200].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Game Mode */}
      <div className="flex items-center gap-2">
        <Users  />
        <label className="font-medium text-gray-700 md:block hidden"> Game Mode:</label>
        <select
          value={vsBot ? "bot" : "2p"}
          onChange={(e) => {
            const isBot = e.target.value === "bot";
            setVsBot(isBot);
            if (isBot) {
              onBotNameChange(
                `BOT (${botDifficulty
                  .charAt(0)
                  .toUpperCase()}${botDifficulty.slice(1)})`
              );
            } else {
              onBotNameChange("PLAYER 2");
            }
          }}
          disabled={disabled}
          className=" border rounded text-sm focus:outline-none focus:ring-0"
        >
          <option value="2p">2 Players</option>
          <option value="bot">Vs Bot</option>
        </select>
      </div>

      {/* Bot Difficulty */}
      {vsBot && (
        <div className="flex items-center gap-2">
          <Bot  />
          <label className=" font-medium text-gray-700 md:block hidden">Bot:</label>
          <select
            value={botDifficulty}
            onChange={(e) => {
              const level = e.target.value as "easy" | "medium" | "hard";
              setBotDifficulty(level);
              onBotNameChange(
                `BOT (${level.charAt(0).toUpperCase()}${level.slice(1)})`
              );
            }}
            disabled={disabled}
            className=" border rounded text-sm focus:outline-none focus:ring-0 "
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
