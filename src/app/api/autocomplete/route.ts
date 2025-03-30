import { NextRequest, NextResponse } from "next/server";
import { serverMAP } from "@/utils/helper";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const region = searchParams.get("region")?.toLowerCase();

    if (!query || !region) {
        return NextResponse.json([], { status: 400 });
    }

    const server = serverMAP[region];
    if (!server) {
        console.warn(`❌ Unknown region: ${region}`);
        return NextResponse.json([], { status: 400 });
    }

    try {
        const results = await prisma.playerInfo.findMany({
            where: {
                server,
                OR: [
                    // Use startsWith for better performance with indexes
                    { gameName: { startsWith: query, mode: "insensitive" } },
                    { tagLine: { startsWith: query, mode: "insensitive" } }
                ]
            },
            orderBy: {
                // Show higher level players first
                summonerLevel: "desc"
            },
            take: 5,
            select: {
                gameName: true,
                tagLine: true,
                summonerLevel: true,
                profileIconId: true
            }
        });

        return NextResponse.json(results);
    } catch (error) {
        console.error("❌ Autocomplete error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
