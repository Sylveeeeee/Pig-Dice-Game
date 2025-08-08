import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        player1: true,
        player2: true,
        winner: true,
      },
      orderBy: { endTime: "desc" },
    });

    const headers = [
      "Game ID",
      "Player 1",
      "Player 2",
      "Player 1 Score",
      "Player 2 Score",
      "Winner",
      "Start Time",
      "End Time",
      "Rolls of 1 (P1)",
      "Rolls of 1 (P2)",
    ];

    const rows = games.map((g) => [
      g.id,
      g.player1.name,
      g.player2.name,
      g.player1Score,
      g.player2Score,
      g.winner?.name || "Draw",
      g.startTime.toISOString(),
      g.endTime.toISOString(),
      g.rollsOf1P1,
      g.rollsOf1P2,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=all_games_history.csv",
      },
    });
  } catch (err) {
    console.error("Failed to export games", err);
    return NextResponse.json(
      { error: "Failed to export games" },
      { status: 500 }
    );
  }
}
