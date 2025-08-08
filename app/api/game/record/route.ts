import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { updatePlayerStatistics } from "@/utils/calculatePlayerStatistics";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    player1Name,
    player2Name,
    player1Score,
    player2Score,
    rollsOf1P1,
    rollsOf1P2,
    startTime,
    endTime,
    vsBot = false,
  } = body;

  try {
    const player1 = await prisma.player.upsert({
      where: { name: player1Name },
      update: {},
      create: { name: player1Name },
    });

    const player2 = await prisma.player.upsert({
      where: { name: player2Name },
      update: {},
      create: { name: player2Name },
    });

    let player2Id: number | null = null;

    if (!vsBot && player2Name) {
      const player2 = await prisma.player.upsert({
        where: { name: player2Name },
        update: {},
        create: { name: player2Name },
      });
      player2Id = player2.id;
    }

    let winnerId = null;
    if (player1Score !== player2Score) {
      winnerId =
        player1Score > player2Score
          ? player1.id
          : player2Id ?? null;
    }

    const game = await prisma.game.create({
      data: {
        player1Id: player1.id,
        player2Id: player2.id,
        player1Score,
        player2Score,
        rollsOf1P1,
        rollsOf1P2,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        winnerId,
        vsBot: vsBot,
      },
    });

    await updatePlayerStatistics(player1.id);
    if (player2Id) {
      await updatePlayerStatistics(player2Id);  
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch (error) {
    console.error("Error recording game:", error);
    return NextResponse.json(
      { error: "Failed to record game" },
      { status: 500 }
    );
  }
}
