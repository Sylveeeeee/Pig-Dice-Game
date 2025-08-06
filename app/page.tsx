"use client";

import { useState } from "react";

export default function Home() {
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [scores, setScores] = useState([0, 0]);
  const [currentScore, setCurrentScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setDiceNumber(null);
    setGameOver(false);
  };

  const rollDice = () => {
    const rolled = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(rolled);

    if (rolled === 1) {
      setCurrentScore(0);
      setActivePlayer(activePlayer === 0 ? 1 : 0);
    } else {
      setCurrentScore(currentScore + rolled);
    }

  };

  const holdScore = () => {
  const updatedScores = [...scores];
  updatedScores[activePlayer] += currentScore;
  
  if (updatedScores[activePlayer] >= 100) {
    alert(`🎉 Player ${activePlayer + 1} wins!`);
    setGameOver(true);
  }

  setScores(updatedScores);
  setCurrentScore(0);
  setActivePlayer(activePlayer === 0 ? 1 : 0);
};

  return (
    <div className="flex justify-center items-center h-screen ">
      <div
        className={`py-10 px-40 text-center rounded-l-2xl transition-all duration-300 ${activePlayer === 0 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
          }`}
      >
        <div className="text-3xl">PLAYER 1</div>
        <p className="text-5xl py-10">{activePlayer === 0 ? (diceNumber ?? 0) : 0}</p>
        <div className="mt-30 py-6 px-10 rounded-2xl bg-blue-200">
          <div className="text-2xl">Current</div>
          <p className="text-3xl mt-5">{activePlayer === 0 ? scores[0] + currentScore : scores[0]}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between h-[500px] absolute ">
        <button onClick={resetGame} className="rounded-full p-3 mt-10 bg-white">NEW GAME</button>
        <div className="flex flex-col pb-15">
          <button onClick={rollDice} disabled={gameOver} className="rounded-full p-3 mb-2 bg-white">ROLL DICE</button>
          <button onClick={holdScore} disabled={gameOver} className="rounded-full p-3 bg-white">HOLD</button>
        </div>
      </div>
      <div
        className={`py-10 px-40 text-center rounded-r-2xl transition-all duration-300 ${activePlayer === 1 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
          }`}
      >
        <div className="text-3xl">PLAYER 2</div>
        <p className="text-5xl py-10">{activePlayer === 1 ? (diceNumber ?? 0) : 0}</p>
        <div className="mt-30 py-6 px-10 rounded-2xl bg-blue-200">
          <div className="text-2xl">Current</div>
          <p className="text-3xl mt-5">{activePlayer === 1 ? scores[1] + currentScore : scores[1]}</p>
        </div>
      </div>
    </div>
  );
}
