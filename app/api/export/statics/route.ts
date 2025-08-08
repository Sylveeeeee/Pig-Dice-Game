import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: { statistics: true },
      orderBy: { name: "asc" },
    });

    const data = players.map((player) => ({
      id: player.id,
      name: player.name,
      statistics: player.statistics || null,
    }));

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=players_statistics.json",
      },
    });
  } catch (err) {
    console.error("Failed to export stats", err);
    return NextResponse.json(
      { error: "Failed to export stats" },
      { status: 500 }
    );
  }
}
