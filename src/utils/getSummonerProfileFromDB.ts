import {FormatResponseReturn,} from "@/types/ProcessedInterfaces";
import { prisma } from "@/lib/prisma";

export async function getCachedProfileFromDB(gameName: string, tagLine: string, server: string): Promise<Omit<FormatResponseReturn, "match"> | null> {
    try {
        const normalizedTagLine = decodeURIComponent(tagLine).toUpperCase();
        const normalizedGameName = decodeURIComponent(gameName);

        console.log("\x1b[34m"); // niebieski
        console.log("┌──────────────────────────────────────────────┐");
        console.log("│           🔍 Checking DB cache...            │");
        console.log("└──────────────────────────────────────────────┘");
        console.log("\x1b[0m");

        console.log(`👤 Nickname: \x1b[36m${normalizedGameName}#${normalizedTagLine}\x1b[0m`);
        console.log(`🌍 Serwer:   \x1b[33m${server.toUpperCase()}\x1b[0m\n`);

        const cached = await prisma.playerInfo.findFirst({
            where: {
                gameName: normalizedGameName,
                tagLine: normalizedTagLine,
                server
            },
            include: {
                soloRanked: true,
                flexRanked: true,
                championMasteries: true,
                rankedEntries: true
            }
        });

        if (!cached) return null;

        return {
            playerInfo: {
                puuid: cached.puuid,
                gameName: cached.gameName,
                tagLine: cached.tagLine,
                profileIconId: cached.profileIconId,
                summonerLevel: cached.summonerLevel,
                server: cached.server
            },
            soloRanked: cached.soloRanked,
            flexRanked: cached.flexRanked,
            championMasteries: cached.championMasteries.map((m) => ({
                championId: m.championId,
                championLevel: m.championLevel,
                championPoints: m.championPoints,
                lastPlayTime: 0,
                championPointsSinceLastLevel: 0,
                championPointsUntilNextLevel: 0,
                chestGranted: false,
                tokensEarned: 0,
                summonerId: "",
                puuid: cached.puuid
            })),
            entries: cached.rankedEntries.map((e) => ({
                queueType: e.queueType,
                tier: e.tier,
                rank: e.rank,
                leaguePoints: e.leaguePoints,
                wins: e.wins,
                losses: e.losses,
                leagueId: "",
                summonerId: "",
                puuid: cached.puuid,
                veteran: false,
                inactive: false,
                freshBlood: false,
                hotStreak: false
            }))
        };
    } catch (error) {
        console.warn("\x1b[31m"); // czerwony
        console.warn("┌──────────────────────────────────────────────┐");
        console.warn("│  ⚠️  ERROR: Failed to load cache profile.    │");
        console.warn("└──────────────────────────────────────────────┘");
        console.warn("\x1b[0m");
        console.warn(error, "\n");
        return null;
    }
}