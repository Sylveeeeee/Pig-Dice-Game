"use client";

import Dice from "./components/Dice";
import WinnerBanner from "./components/WinnerBanner";


import { useState } from "react";

export default function Home() {
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [currentScore, setCurrentScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const playerNames = ["PLAYER 1", "PLAYER 2"];

  const resetGame = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setDiceNumber(null);
    setGameOver(false);
  };

  const rollDice = async () => {

    setRolling(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const rolled = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(rolled);

    if (rolled === 1) {
      setCurrentScore(0);
      setActivePlayer(activePlayer === 0 ? 1 : 0);
    } else {
      setCurrentScore(currentScore + rolled);
    }
    setRolling(false);
  };

  const holdScore = () => {
    const updatedScores = [...scores];
    updatedScores[activePlayer] += currentScore;

    if (updatedScores[activePlayer] >= 1) {
      setGameOver(true);
      setWinner(activePlayer);
    }

    setScores(updatedScores);
    setDiceNumber(null);
    setCurrentScore(0);
    setActivePlayer(activePlayer === 0 ? 1 : 0);
  };

  return (
    <div className="flex-col flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Roll Dice Game</h1>
      <div className="bg-[#ffffff59] w-4xl py-2 rounded-full mb-2 text-center">
        {gameOver && winner !== null ? (
          <WinnerBanner winnerName={playerNames[winner]} />
        ) : (
          <p className="font-semibold text-2xl">
            {`It's ${playerNames[activePlayer]}'s turn!`}
          </p>
        )}

      </div>

      <div className="flex justify-center items-center  ">
        {/* PLAYER 1 */}
        <div
          className={`py-10 px-40 text-center rounded-l-2xl transition-all duration-300 ${activePlayer === 0 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
            }`}
        >
          <div className="text-3xl">PLAYER 1</div>
          <p className="text-5xl py-10">{scores[0]}</p>
          <div className="mt-30 py-6 px-10 rounded-2xl bg-[#ffffff59]">
            <div className="text-2xl">Current</div>
            <p className="text-3xl mt-5">{activePlayer === 0 ? currentScore : 0}</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col justify-between items-center h-[500px] absolute ">
          <button onClick={resetGame} className="rounded-full px-6 p-3 mt-10 bg-[#f87171] hover:bg-[#fca5a5] text-white font-semibold shadow-md transition ">NEW GAME</button>
          <Dice number={diceNumber} rolling={rolling} />
          <div className="flex flex-col pb-15 space-y-3">
            <button onClick={rollDice} disabled={gameOver} className={`rounded-full px-6 py-3 bg-[#31fd42] hover:bg-[#28a745] text-white font-semibold shadow-md transition duration-200 ${gameOver ? "opacity-50 cursor-not-allowed" : ""
              }`}>ROLL DICE</button>
            <button onClick={holdScore} disabled={gameOver} className={`rounded-full px-6 py-3 bg-[#ffcb5b] hover:bg-[#eab308] text-white font-semibold shadow-md transition duration-200 ${gameOver ? "opacity-50 cursor-not-allowed" : ""
              }`}>HOLD</button>
          </div>
        </div>

        {/* PLAYER 2 */}
        <div
          className={`py-10 px-40 text-center rounded-r-2xl transition-all duration-300 ${activePlayer === 1 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
            }`}
        >
          <div className="text-3xl">PLAYER 2</div>
          <p className="text-5xl py-10">{scores[1]}</p>
          <div className="mt-30 py-6 px-10 rounded-2xl bg-[#ffffff59]">
            <div className="text-2xl">Current</div>
            <p className="text-3xl mt-5">{activePlayer === 1 ? currentScore : 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
