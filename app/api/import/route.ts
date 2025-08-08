import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

type PlayerImport = {
  id: number;
  name: string;
  createdAt?: string; 
};

type PlayerStatisticsImport = {
  playerId: number;
  totalGames: number;
  wins: number;
  losses: number;
  winPercentage: number;
  avgScorePerGame: number;
  maxScore: number;
  avgGameDuration: number;
  totalRollsOf1: number;
};

type GameImport = {
  id?: number; 
  player1Id: number;
  player2Id: number;
  winnerId?: number | null;
  player1Score: number;
  player2Score: number;
  startTime: string;
  endTime: string;
  rollsOf1P1: number;
  rollsOf1P2: number;
};


export async function POST(request: Request) {
  try {
    const body = await request.json();

    let players: PlayerImport[] = [];
    let statistics: PlayerStatisticsImport[] = [];
    let games: GameImport[] = [];

    if (
      typeof body === "object" &&
      "players" in body &&
      "statistics" in body &&
      "games" in body
    ) {
      players = body.players;
      statistics = body.statistics;
      games = body.games;
    }

    else if (Array.isArray(body) && body[0]?.name && "statistics" in body[0]) {
      players = body.map((p) => ({ id: p.id, name: p.name }));
      statistics = body
        .filter((p) => p.statistics !== null)
        .map((p) => p.statistics);
    }

    else if (Array.isArray(body) && body[0]?.player1Id && body[0]?.player2Id) {
      games = body;
    } else {
      return NextResponse.json({ error: "รูปแบบข้อมูลไม่รองรับ" }, { status: 400 });
    }

    for (const p of players) {
      await prisma.player.upsert({
        where: { id: p.id },
        update: { name: p.name },
        create: { id: p.id, name: p.name },
      });
    }

    for (const s of statistics) {
      await prisma.playerStatistics.upsert({
        where: { playerId: s.playerId },
        update: {
          totalGames: s.totalGames,
          wins: s.wins,
          losses: s.losses,
          winPercentage: s.winPercentage,
          avgScorePerGame: s.avgScorePerGame,
          maxScore: s.maxScore,
          avgGameDuration: s.avgGameDuration,
          totalRollsOf1: s.totalRollsOf1,
        },
        create: {
          playerId: s.playerId,
          totalGames: s.totalGames,
          wins: s.wins,
          losses: s.losses,
          winPercentage: s.winPercentage,
          avgScorePerGame: s.avgScorePerGame,
          maxScore: s.maxScore,
          avgGameDuration: s.avgGameDuration,
          totalRollsOf1: s.totalRollsOf1,
        },
      });
    }

    for (const g of games) {
      await prisma.game.upsert({
        where: { id: g.id },
        update: {
          player1Id: g.player1Id,
          player2Id: g.player2Id,
          winnerId: g.winnerId,
          player1Score: g.player1Score,
          player2Score: g.player2Score,
          startTime: new Date(g.startTime),
          endTime: new Date(g.endTime),
          rollsOf1P1: g.rollsOf1P1,
          rollsOf1P2: g.rollsOf1P2,
        },
        create: {
          id: g.id,
          player1Id: g.player1Id,
          player2Id: g.player2Id,
          winnerId: g.winnerId,
          player1Score: g.player1Score,
          player2Score: g.player2Score,
          startTime: new Date(g.startTime),
          endTime: new Date(g.endTime),
          rollsOf1P1: g.rollsOf1P1,
          rollsOf1P2: g.rollsOf1P2,
        },
      });
    }

    return NextResponse.json({
      message: "✅ นำเข้าข้อมูลสำเร็จ",
      count: {
        players: players.length,
        statistics: statistics.length,
        games: games.length,
      },
    });
  } catch (err) {
    console.error("❌ Import failed:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
