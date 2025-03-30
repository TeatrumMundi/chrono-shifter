import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const puuid = req.nextUrl.searchParams.get("puuid");
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);

    if (!puuid) return NextResponse.json({ error: "Missing puuid" }, { status: 400 });

    const matches = await prisma.match.findMany({
        where: {
            participants: {
                some: { puuid }
            }
        },
        include: {
            participants: true
        },
        orderBy: {
            gameEndTimestamp: "desc"
        },
        skip: offset,
        take: limit
    });

    return NextResponse.json(
        matches.map((match) => ({
            ...match,
            gameEndTimestamp: Number(match.gameEndTimestamp),
            participants: match.participants.map((p) => ({...p,})),
        }))
    );
}