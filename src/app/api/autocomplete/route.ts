import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { serverMAP } from "@/utils/helper";

const prisma = new PrismaClient();

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
                    { gameName: { contains: query, mode: "insensitive" } },
                    { tagLine: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 10,
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