import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: { statistics: true },
    });

    const games = await prisma.game.findMany({
      include: { player1: true, player2: true, winner: true },
    });

    const backupData = {
      createdAt: new Date().toISOString(),
      players,
      games,
    };

    const fileName = `backup-${Date.now()}.json`;
    const filePath = path.join(process.cwd(), "backups", fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    return NextResponse.json({
      message: "Backup completed",
      file: fileName,
    });
  } catch (err) {
    console.error("Backup failed:", err);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}
