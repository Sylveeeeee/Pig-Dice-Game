import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        const winnerId =
            player1Score > player2Score
                ? player1.id
                : player2Score > player1Score
                    ? player2.id
                    : null;

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
            },
        });

        return NextResponse.json({ game }, { status: 200 });
    } catch (error) {
        console.error("Error recording game:", error);
        return NextResponse.json({ error: "Failed to record game" }, { status: 500 });
    }
}
