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
    const res = await fetch("/api/game/history");
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export async function fetchPlayerStatistics(playerName: string) {
  try {
    const res = await fetch(`/api/player/stats?name=${playerName}`);
    if (!res.ok) throw new Error("Failed to fetch statistics");
    return await res.json();
  } catch (error) {
    console.error("Error fetching player statistics:", error);
    return null;
  }
}

export async function fetchPlayerGameHistory(playerName: string) {
  try {
    const res = await fetch(`/api/player/games?name=${playerName}`);
    if (!res.ok) throw new Error("Failed to fetch games");
    return await res.json();
  } catch (error) {
    console.error("Error fetching player game history:", error);
    return [];
  }
}

export async function exportAllStats() {
  const res = await fetch("/api/export/statics");
  if (!res.ok) throw new Error("Failed to export statistics");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "players_statistics.json";
  a.click();

  URL.revokeObjectURL(url);
}

export async function exportAllGames() {
  const res = await fetch("/api/export/games");
  if (!res.ok) throw new Error("Failed to export games");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "all_games_history.csv";
  a.click();

  URL.revokeObjectURL(url);
}

export async function importFullData(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);

  const res = await fetch("/api/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Import failed");
  return await res.json();
}

export async function deleteGameById(gameId: number | string): Promise<void> {
  const url = new URL(`/api/game/delete/${gameId}`, window.location.origin);
  const res = await fetch(url.toString(), { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete game");
  }
  console.log("Game deleted successfully");
}


export async function resetAllData() {
  const res = await fetch("/api/reset", {
    method: "DELETE",
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Data reset failed");
  }

  return res.json();
}

export async function backupNow() {
  const res = await fetch("/api/backup");
  if (!res.ok) throw new Error("Backup failed");
  return await res.json();
}
