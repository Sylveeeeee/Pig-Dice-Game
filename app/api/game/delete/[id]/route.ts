import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updatePlayerStatistics } from "@/utils/calculatePlayerStatistics";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);

  if (isNaN(gameId)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    } 

    await prisma.game.delete({ where: { id: gameId } });

    await updatePlayerStatistics(game.player1Id);
    await updatePlayerStatistics(game.player2Id);

    return NextResponse.json({ message: "Game deleted and player statistics updated successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
