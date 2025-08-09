"use client";

//import Dice from "./components/Dice";
import GameSettings from "./components/GameSettings";
import WinnerBanner from "./components/WinnerBanner";
import { Pencil, Menu, RotateCcw, Shell, Hand } from "lucide-react";
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
      <h1 className="hidden md:block text-4xl font-bold mb-10">Roll Dice Game</h1>
      <div className="mb-2 flex items-center gap-2">
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
          className="hidden bg-[#ffffff59] md:flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79]"
        >
          <Menu />
        </button>
        <MenuModal isOpen={showMenu} onClose={() => setShowMenu(false)} />
      </div>
      <div className="hidden md:block bg-[#ffffff59] lg:w-4xl md:w-3/4 py-2 rounded-full mb-2 text-center">
        {gameOver && winner !== null ? (
          <WinnerBanner winnerName={playerNames[winner]} />
        ) : (
          <p className="font-semibold text-2xl">
            {`It's ${playerNames[activePlayer]}'s turn!`}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-center items-center lg:w-7/8 md:w-22/23 w-full  py-2 ">
        <div className="md:hidden flex justify-between items-center absolute px-5 z-10 w-full">
          <button
            onClick={resetGame}
            className={`rounded-full px-3 py-2 lg:mt-10 md:mt-10 bg-[#f87171] hover:bg-[#fca5a5] text-white font-semibold shadow-md transition ${gameOver ? "animate-pulse " : ""
              }`}
          >
            <RotateCcw />
          </button>
          <div className="md:hidden block   z-10">
            <Dice3D number={diceNumber} rolling={rolling} />
          </div>
          <button
            onClick={() => setShowMenu(true)}
            className="bg-[#ffffff59] md:flex items-center p-2.5 shadow rounded-xl gap-2 hover:bg-[#ffffff79]"
          >
            <Menu />
          </button>

          <MenuModal isOpen={showMenu} onClose={() => setShowMenu(false)}
          />
        </div>

        {/* PLAYER 1 */}
        <div
          className={` md:h-[520px] h-1/2 md:w-1/2 w-[95%] md:py-10 flex-col flex justify-between items-center text-center md:rounded-l-2xl md:rounded-r-none rounded-b-2xl transition-all duration-300 ${activePlayer === 0 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
            }`}
        >
          {/*  Editable Player Name */}
          <div className="text-3xl flex items-center justify-center gap-2 mb-4 md:mt-0 mt-30">
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
                className="lg:text-3xl md:text-2xl text-[16px] font-bold text-center border-b w-1/2  transition-all duration-150 focus:outline-none focus:ring-0"
              />
            ) : (
              <span className="font-bold lg:text-3xl md:text-2xl text-[16px] text-center">
                {playerNames[0]}
              </span>
            )}
            <button
              onClick={() => setEditingNameIndex(0)}
              className="hover:text-gray-700 text-black"
            >
              <Pencil size={16} />
            </button>
          </div>

          {/* Total Score */}
          <p
            className={`hidden md:block text-5xl lg:py-10 transition-transform duration-500 ${scoreAnimated[0] ? "scale-125 text-green-500" : ""
              }`}
          >
            {scores[0]}
          </p>
          {/* Current Score */}
          <div className="flex md:justify-center justify-between items-center w-full px-2 py-2">
            <div className="md:py-6 py-8 lg:px-10 w-3/8 rounded-2xl bg-[#ffffff59]">
              <div className="md:text-2xl text-[16px]">Current</div>
              <p
                className={`text-4xl md:mt-5  transition-transform duration-500 ${activePlayer === 0 && scoreCurrentAnimated
                  ? "scale-125 text-green-500"
                  : ""
                  }`}
              >
                {activePlayer === 0 ? currentScore : 0}
              </p>
            </div>
            <div className="md:hidden px-2">
              <div className="flex  flex-col lg:pb-15 md:pb-10 space-y-2 text-[16px]">

                <button
                  onClick={holdScore}
                  disabled={gameOver || (activePlayer === 1) || rolling || (vsBot && activePlayer === 1)}
                  className={`rounded-full p-2 bg-[#ffcb5b] hover:bg-[#eab308] text-white font-semibold shadow-md transition duration-200 ${gameOver || (activePlayer === 1) || rolling || (vsBot && activePlayer === 1)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  <Hand size={40} />
                </button>
                <button
                  onClick={handlePlayerRoll}
                  disabled={gameOver || (activePlayer === 1) || rolling || (vsBot && activePlayer === 1)}
                  className={`rounded-full p-2 bg-[#31fd42] hover:bg-[#28a745] text-white font-semibold shadow-md transition duration-200 ${gameOver || (activePlayer === 1) || rolling || (vsBot && activePlayer === 1)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  <Shell size={40} />
                </button>
              </div>
            </div>
            <div className="md:hidden md:py-6 py-8 lg:px-10 w-3/8 rounded-2xl bg-[#ffffff59]">
              <div className="md:text-2xl text-[16px]">score</div>
              <p
                className={`md:hidden text-4xl lg:py-10 transition-transform duration-500 ${scoreAnimated[0] ? "scale-125 text-green-500" : ""
                  }`}
              >
                {scores[0]}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="hidden md:flex flex-col justify-between items-center h-[520px] absolute ">
          <button
            onClick={resetGame}
            className={`rounded-full px-6 p-3 lg:mt-10 md:mt-10 bg-[#f87171] hover:bg-[#fca5a5] text-white font-semibold shadow-md transition ${gameOver ? "animate-pulse " : ""
              }`}
          >
            NEW GAME
          </button>
          <Dice3D number={diceNumber} rolling={rolling} />
          <div className="flex  flex-col lg:pb-15 md:pb-10 space-y-3">
            <button
              onClick={handlePlayerRoll}
              disabled={gameOver || rolling || (vsBot && activePlayer === 1)}
              className={`rounded-full px-6 py-3 bg-[#31fd42] hover:bg-[#28a745] text-white font-semibold shadow-md transition duration-200 ${gameOver || rolling || (vsBot && activePlayer === 1)
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
            >
              ROLL DICE
            </button>
            <button
              onClick={holdScore}
              disabled={gameOver || rolling || (vsBot && activePlayer === 1)}
              className={`rounded-full px-6 py-3 bg-[#ffcb5b] hover:bg-[#eab308] text-white font-semibold shadow-md transition duration-200 ${gameOver || rolling || (vsBot && activePlayer === 1)
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
          className={` rotate-180 md:rotate-none h-1/2 md:h-[520px] md:w-1/2 w-[95%] md:py-10 flex-col flex justify-between items-center text-center md:rounded-r-2xl md:rounded-l-none rounded-b-2xl transition-all duration-300 ${activePlayer === 1 ? "bg-[#ffffff9a]" : "bg-[#ffffff59]"
            }`}
        >
          {/*  Editable Player Name */}
          <div className="text-3xl flex items-center justify-center gap-2 mb-4 md:mt-0 mt-30">
            {editingNameIndex === 1 && !vsBot ? (
              <input
                type="text"
                value={playerNames[1]}
                onChange={(e) => handleNameChange(1, e.target.value)}
                onBlur={stopEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") stopEditing();
                }}
                className="lg:text-3xl md:text-2xl text-[16px] font-bold text-center border-b w-1/2  transition-all duration-150 focus:outline-none focus:ring-0 "
              />
            ) : (
              <span className="font-bold lg:text-3xl md:text-2xl text-[16px] text-center">
                {playerNames[1]}
              </span>
            )}
            <button
              onClick={() => setEditingNameIndex(1)}
              className="hover:text-gray-700 text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
          <p
            className={`hidden md:block text-5xl lg:py-10 transition-transform duration-500 ${scoreAnimated[1] ? "scale-125 text-green-500" : ""
              }`}
          >
            {scores[1]}
          </p>
          {/* Current Score */}
          <div className="flex md:justify-center justify-between items-center w-full px-2 py-2 ">
            <div className="md:py-6 py-8 lg:px-10 w-3/8 rounded-2xl bg-[#ffffff59]">
              <div className="md:text-2xl text-[16px]">Current</div>
              <p
                className={`text-4xl md:mt-5  transition-transform duration-500 ${activePlayer === 1 && scoreCurrentAnimated
                  ? "scale-125 text-green-500"
                  : ""
                  }`}
              >
                {activePlayer === 1 ? currentScore : 0}
              </p>
            </div>
            <div className="md:hidden px-2 ">
              <div className="flex  flex-col lg:pb-15 md:pb-10 space-y-2 text-[16px]">
                <button
                  onClick={holdScore}
                  disabled={gameOver || (activePlayer === 0) || rolling || (vsBot && activePlayer === 1)}
                  className={`rounded-full p-2 bg-[#ffcb5b] hover:bg-[#eab308] text-white font-semibold shadow-md transition duration-200 ${gameOver || (activePlayer === 0) || rolling || (vsBot && activePlayer === 1)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  <Hand size={40} />
                </button>
                <button
                  onClick={handlePlayerRoll}
                  disabled={gameOver || (activePlayer === 0) || rolling || (vsBot && activePlayer === 1)}
                  className={`rounded-full p-2 bg-[#31fd42] hover:bg-[#28a745] text-white font-semibold shadow-md transition duration-200 ${gameOver || (activePlayer === 0) || rolling || (vsBot && activePlayer === 1)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  <Shell size={40} />
                </button>
              </div>
            </div>
            <div className="md:hidden md:py-6 py-8 lg:px-10 w-3/8 rounded-2xl bg-[#ffffff59]">
              <div className="md:text-2xl text-[16px]">score</div>
              <p
                className={`md:hidden text-4xl lg:py-10 transition-transform duration-500 ${scoreAnimated[1] ? "scale-125 text-green-500" : ""
                  }`}
              >
                {scores[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
