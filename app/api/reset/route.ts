
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await prisma.game.deleteMany({});

    await prisma.playerStatistics.deleteMany({});

    await prisma.player.deleteMany({});

    return NextResponse.json({ message: "รีเซตข้อมูลทั้งหมดเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการรีเซต" }, { status: 500 });
  }
}
