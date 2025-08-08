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

  const player = await prisma.player.findUnique({
    where: { name },
    include: { statistics: true },
  });

  if (!player || !player.statistics) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json(player.statistics);
}
