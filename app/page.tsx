"use client";

//import Dice from "./components/Dice";
import GameSettings from "./components/GameSettings";
import WinnerBanner from "./components/WinnerBanner";
import { Pencil, Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Dice3D from "./components/Dice3D";
import { saveGameToServer } from "@/utils/api";
import MenuModal from "./components/MenuModal";

export default function Home() {
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [targetScore, setTargetScore] = useState(100);
  const [currentScore, setCurrentScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [playerNames, setPlayerNames] = useState(["PLAYER 1", "PLAYER 2"]);
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null);
  const [botDifficulty, setBotDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [vsBot, setVsBot] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const [scoreCurrentAnimated, setScoreCurrentAnimated] = useState(false);
  const [scoreAnimated, setScoreAnimated] = useState([false, false]);
  const [rollsOf1, setRollsOf1] = useState([0, 0]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showMenu, setShowMenu] = useState(false);

  const handleGameEnd = useCallback(
  async (finalScores: number[]) => {
    const now = new Date();

    await saveGameToServer({
      player1Name: playerNames[0],
      player2Name: playerNames[1],
      player1Score: finalScores[0],
      player2Score: finalScores[1],
      rollsOf1P1: rollsOf1[0],
      rollsOf1P2: rollsOf1[1],
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
    });
  },
  [playerNames, rollsOf1, startTime]
);

  const resetGame = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setDiceNumber(null);
    setGameOver(false);
    setWinner(null);
    setStartTime(new Date());
  };

  const handlePlayerRoll = async () => {
    if (gameOver || rolling || (vsBot && activePlayer === 1)) return;

    const rolled = await rollDice();

    if (rolled === 1) {
      setRollsOf1((prev) => {
        const updated = [...prev];
        updated[activePlayer]++;
        return updated;
      });
      setCurrentScore(0);
      setActivePlayer((prev) => (prev === 0 ? 1 : 0));
    } else {
      setCurrentScore((prev) => {
        const newScore = prev + rolled;
        setScoreCurrentAnimated(true);
        setTimeout(() => setScoreCurrentAnimated(false), 600);

        return newScore;
      });
    }
  };

  const rollDice = async (): Promise<number> => {
    setRolling(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const rolled = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(rolled);
    console.log("Rolled:", rolled);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRolling(false);
    return rolled;
  };

  const holdScore = () => {
    const updatedScores = [...scores];
    const addedScore = currentScore;
    updatedScores[activePlayer] += currentScore;

    const winnerReached = updatedScores[activePlayer] >= targetScore;

    if (winnerReached) {
      setGameOver(true);
      setWinner(activePlayer);

      handleGameEnd(updatedScores);
    }

    if (addedScore > 0) {
      setScoreAnimated((prev) => {
        const updated = [...prev];
        updated[activePlayer] = true;
        return updated;
      });

      setTimeout(() => {
        setScoreAnimated((prev) => {
          const updated = [...prev];
          updated[activePlayer] = false;
          return updated;
        });
      }, 600);
    }
    setScores(updatedScores);
    setDiceNumber(null);
    setCurrentScore(0);
    setActivePlayer(activePlayer === 0 ? 1 : 0);
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);
  };

  const stopEditing = () => {
    if (editingNameIndex !== null) {
      const trimmed = playerNames[editingNameIndex].trim();

      if (!trimmed) {
        const defaultName = `PLAYER ${editingNameIndex + 1}`;
        const updated = [...playerNames];
        updated[editingNameIndex] = defaultName;
        setPlayerNames(updated);
      }
    }
    setEditingNameIndex(null);
  };

  const botPlay = useCallback(async () => {
    if (gameOver || rolling || botThinking) return;

    setBotThinking(true);

    const rolled = await rollDice();

    if (rolled === 1) {
      setCurrentScore(0);
      setActivePlayer(0);
      setBotThinking(false);
      return;
    }

    const newScore = currentScore + rolled;

    const shouldHold = (() => {
      switch (botDifficulty) {
        case "easy":
          return Math.random() < 0.5;
        case "medium":
          return newScore >= 20;
        case "hard":
          const projectedScore = scores[1] + newScore;
          const playerScore = scores[0];
          return (
            projectedScore >= targetScore ||
            projectedScore > playerScore + 10 ||
            newScore >= 15
          );
        default:
          return false;
      }
    })();

    if (shouldHold) {
      const updatedScores = [...scores];
      updatedScores[1] += newScore;

      if (updatedScores[1] >= targetScore) {
        setScores(updatedScores);
        setGameOver(true);
        setWinner(1);
        await handleGameEnd(updatedScores);
      } else {
        setScores(updatedScores);
        setCurrentScore(0);
        setActivePlayer(0);
      }
      setBotThinking(false);
    } else {
      setCurrentScore(newScore);
      setScoreCurrentAnimated(true);
      setTimeout(() => setScoreCurrentAnimated(false), 600);

      setTimeout(() => {
        setBotThinking(false);
      }, 1000);
    }
  }, [
    botDifficulty,
    currentScore,
    scores,
    targetScore,
    gameOver,
    rolling,
    botThinking,
    handleGameEnd
  ]);

  useEffect(() => {
    if (vsBot && activePlayer === 1 && !gameOver && !rolling && !botThinking) {
      console.log("DiceNumber updated:", diceNumber);
      const timer = setTimeout(() => {
        botPlay();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [
    activePlayer,
    vsBot,
    gameOver,
    rolling,
    botThinking,
    diceNumber,
    botPlay,
  ]);

  return (
    <div className="flex-col flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Roll Dice Game</h1>
      <div className="mb-4 flex items-center gap-2">
        <GameSettings
          targetScore={targetScore}
          setTargetScore={setTargetScore}
          vsBot={vsBot}
          setVsBot={setVsBot}
          botDifficulty={botDifficulty}
          setBotDifficulty={setBotDifficulty}
          disabled={scores[0] > 0 || scores[1] > 0}
          onBotNameChange={(name) => {
            setPlayerNames((prev) => {
              const updated = [...prev];
              updated[1] = name;
              return updated;
            });
          }}
        />
        <button
          onClick={() => setShowMenu(true)}
          className="bg-[#ffffff59] flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79]"
        >
          <Menu />
        </button>
        <MenuModal isOpen={showMenu} onClose={() => setShowMenu(false)} />
      </div>
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
          className={`py-10 px-40 text-center rounded-l-2xl transition-all duration-300 ${
            activePlayer === 0 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
          }`}
        >
          {/*  Editable Player Name */}
          <div className="text-3xl flex items-center justify-center gap-2 mb-4">
            {editingNameIndex === 0 ? (
              <input
                type="text"
                value={playerNames[0]}
                onChange={(e) => handleNameChange(0, e.target.value)}
                onBlur={stopEditing}
                maxLength={10}
                onKeyDown={(e) => {
                  if (e.key === "Enter") stopEditing();
                }}
                className="text-3xl font-bold text-center px-2 py-1 border-b w-[200px] h-[40px] transition-all duration-150 focus:outline-none focus:ring-0 "
              />
            ) : (
              <span className="font-bold text-3xl px-2 py-1 text-center  w-[200px] h-[40px]">
                {playerNames[0]}
              </span>
            )}
            <button
              onClick={() => setEditingNameIndex(0)}
              className="hover:text-gray-700 text-black"
            >
              <Pencil />
            </button>
          </div>

          {/* Total Score */}
          <p
            className={`text-5xl py-10 transition-transform duration-500 ${
              scoreAnimated[0] ? "scale-125 text-green-500" : ""
            }`}
          >
            {scores[0]}
          </p>
          {/* Current Score */}
          <div className="mt-30 py-6 px-10 rounded-2xl bg-[#ffffff59]">
            <div className="text-2xl">Current</div>
            <p
              className={`text-4xl mt-5 font-bold transition-transform duration-500 ${
                activePlayer === 0 && scoreCurrentAnimated
                  ? "scale-125 text-green-500"
                  : ""
              }`}
            >
              {activePlayer === 0 ? currentScore : 0}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col justify-between items-center h-[500px] absolute ">
          <button
            onClick={resetGame}
            className={`rounded-full px-6 p-3 mt-10 bg-[#f87171] hover:bg-[#fca5a5] text-white font-semibold shadow-md transition ${
              gameOver ? "animate-pulse " : ""
            }`}
          >
            NEW GAME
          </button>
          <Dice3D number={diceNumber} rolling={rolling} />
          <div className="flex flex-col pb-15 space-y-3">
            <button
              onClick={handlePlayerRoll}
              disabled={gameOver || rolling || (vsBot && activePlayer === 1)}
              className={`rounded-full px-6 py-3 bg-[#31fd42] hover:bg-[#28a745] text-white font-semibold shadow-md transition duration-200 ${
                gameOver || rolling || (vsBot && activePlayer === 1)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              ROLL DICE
            </button>
            <button
              onClick={holdScore}
              disabled={gameOver || rolling || (vsBot && activePlayer === 1)}
              className={`rounded-full px-6 py-3 bg-[#ffcb5b] hover:bg-[#eab308] text-white font-semibold shadow-md transition duration-200 ${
                gameOver || rolling || (vsBot && activePlayer === 1)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              HOLD
            </button>
          </div>
        </div>

        {/* PLAYER 2 */}
        <div
          className={`py-10 px-40 text-center rounded-r-2xl transition-all duration-300 ${
            activePlayer === 1 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
          }`}
        >
          {/*  Editable Player Name */}
          <div className="text-3xl flex items-center justify-center gap-2 mb-4">
            {editingNameIndex === 1 && !vsBot ? (
              <input
                type="text"
                value={playerNames[1]}
                onChange={(e) => handleNameChange(1, e.target.value)}
                onBlur={stopEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") stopEditing();
                }}
                className="text-3xl font-bold text-center px-2 py-1 border-b w-[200px] h-[40px] focus:outline-none focus:ring-0 "
              />
            ) : (
              <span className="font-bold text-3xl px-2 py-1 text-center  w-[200px] h-[40px]">
                {playerNames[1]}
              </span>
            )}
            <button
              onClick={() => setEditingNameIndex(1)}
              className="hover:text-gray-700 text-black"
            >
              <Pencil />
            </button>
          </div>
          <p
            className={`text-5xl py-10 transition-transform duration-500 ${
              scoreAnimated[1] ? "scale-125 text-green-500" : ""
            }`}
          >
            {scores[1]}
          </p>
          <div className="mt-30 py-6 px-10 rounded-2xl bg-[#ffffff59]">
            <div className="text-2xl">Current</div>
            <p
              className={`text-4xl mt-5 font-bold transition-transform duration-500 ${
                activePlayer === 1 && scoreCurrentAnimated
                  ? "scale-125 text-green-500"
                  : ""
              }`}
            >
              {activePlayer === 1 ? currentScore : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
