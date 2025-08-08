import { prisma } from "@/utils/prisma";

export async function calculatePlayerStatistics(playerId: number) {
  const games = await prisma.game.findMany({
    where: {
      OR: [{ player1Id: playerId }, { player2Id: playerId }],
    },
  });

  if (games.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      avgScorePerGame: 0,
      maxScore: 0,
      avgGameDuration: 0,
      totalRollsOf1: 0,
    };
  }

  const totalGames = games.length;
  let wins = 0;
  let totalScore = 0;
  let maxScore = 0;
  let totalDurationMs = 0;
  let totalRollsOf1 = 0;

  for (const game of games) {
    const isPlayer1 = game.player1Id === playerId;
    const playerScore = isPlayer1 ? game.player1Score : game.player2Score;
    const rollsOf1 = isPlayer1 ? game.rollsOf1P1 : game.rollsOf1P2;
    const isWinner = game.winnerId === playerId;

    totalScore += playerScore;
    if (playerScore > maxScore) maxScore = playerScore;

    totalDurationMs +=
      new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
    totalRollsOf1 += rollsOf1;

    if (isWinner) wins++;
  }

  const losses = totalGames - wins;
  const winPercentage = wins / totalGames;
  const avgScorePerGame = totalScore / totalGames;
  const avgGameDuration = totalDurationMs / totalGames / 1000;

  return {
    totalGames,
    wins,
    losses,
    winPercentage,
    avgScorePerGame,
    maxScore,
    avgGameDuration,
    totalRollsOf1,
  };
}

export async function updatePlayerStatistics(playerId: number) {
  const stats = await calculatePlayerStatistics(playerId);
  await prisma.playerStatistics.upsert({
    where: { playerId },
    update: stats,
    create: { playerId, ...stats },
  });
}
