import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { endTime: "desc" },
      take: 10,
      include: {
        player1: true,
        player2: true,
        winner: true,
      },
    });

    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("Error fetching game history:", error);
    return NextResponse.json(
      { error: "Failed to fetch game history" },
      { status: 500 }
    );
  }
}
