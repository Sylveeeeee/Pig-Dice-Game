export const saveGameToServer = async (gameData: {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  rollsOf1P1: number;
  rollsOf1P2: number;
  startTime: string;
  endTime: string;
}) => {
  try {
    const res = await fetch("/api/game/record", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    });

    if (!res.ok) throw new Error("Failed to save game");

    return await res.json();
  } catch (error) {
    console.error("Error saving game:", error);
    return null;
  }
};

export const fetchGameHistory = async () => {
  try {
    const res = await fetch('/api/game/history');
    if (!res.ok) throw new Error('Failed to fetch history');
    return await res.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};