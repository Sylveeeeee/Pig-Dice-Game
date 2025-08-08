import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing name parameter" },
      { status: 400 }
    );
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        OR: [{ player1: { name } }, { player2: { name } }],
      },
      include: {
        player1: { select: { name: true } },
        player2: { select: { name: true } },
        winner: { select: { name: true } },
      },
      orderBy: {
        endTime: "desc",
      },
    });

    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
