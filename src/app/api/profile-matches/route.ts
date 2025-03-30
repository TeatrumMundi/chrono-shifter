import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const puuid = searchParams.get("puuid");
        const offset = parseInt(searchParams.get("offset") || "0", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        if (!puuid) {
            return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
        }

        const matches = await prisma.match.findMany({
            where: {
                participants: {
                    some: { puuid }
                }
            },
            orderBy: { gameEndTimestamp: "desc" },
            skip: offset,
            take: limit,
            select: {
                matchId: true,
                gameMode: true,
                queueId: true,
                gameDuration: true,
                gameEndTimestamp: true,
                participants: {
                    select: {
                        puuid: true,
                        riotIdGameName: true,
                        riotIdTagline: true,
                        champion: true,
                        kills: true,
                        deaths: true,
                        assists: true,
                        teamPosition: true,
                        win: true,
                        server: true
                    }
                }
            }
        });

        return NextResponse.json(
            JSON.parse(
                JSON.stringify(matches, (_, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )
            )
        );
    } catch (err) {
        console.error("❌ API /profile-matches error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
