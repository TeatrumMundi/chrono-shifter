import {
    FormatResponseReturn,
    Champion,
    Rune,
    Item,
    ArenaData
} from "@/types/ProcessedInterfaces";
import { prisma } from "@/lib/prisma";

export async function getCachedProfileFromDB(
    gameName: string,
    tagLine: string,
    server: string
): Promise<FormatResponseReturn | null> {
    try {
        const normalizedTagLine = decodeURIComponent(tagLine).toUpperCase();
        const normalizedGameName = decodeURIComponent(gameName);

        console.log("\n🔍 Checking DB cache for:", JSON.stringify({ normalizedGameName, normalizedTagLine, server }) + "\n");

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

        // Pobierz mecze na podstawie PUUID gracza
        const matches = await prisma.match.findMany({
            where: {
                participants: {
                    some: {
                        puuid: cached.puuid
                    }
                }
            },
            include: {
                participants: true
            },
            orderBy: {
                gameEndTimestamp: 'desc'
            }
        });

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
            match: matches.map((match) => ({
                matchId: match.matchId,
                gameMode: match.gameMode,
                queueId: match.queueId,
                gameDuration: match.gameDuration,
                gameEndTimestamp: Number(match.gameEndTimestamp),
                participants: match.participants.map((p) => ({
                    riotIdGameName: p.riotIdGameName,
                    riotIdTagline: p.riotIdTagline,
                    server: p.server,
                    puuid: p.puuid,
                    teamPosition: p.teamPosition,
                    champLevel: p.champLevel,
                    kills: p.kills,
                    deaths: p.deaths,
                    assists: p.assists,
                    kda: p.kda,
                    visionScore: p.visionScore,
                    visionPerMinute: p.visionPerMinute,
                    damageDealt: p.damageDealt,
                    goldEarned: p.goldEarned,
                    wardsPlaced: p.wardsPlaced,
                    totalHealsOnTeammates: p.totalHealsOnTeammates,
                    totalDamageShieldedOnTeammates: p.totalDamageShieldedOnTeammates,
                    minionsKilled: p.minionsKilled,
                    minionsPerMinute: p.minionsPerMinute,
                    win: p.win,
                    teamId: p.teamId,
                    champion: p.champion as unknown as Champion,
                    runes: p.runes as unknown as Rune[],
                    items: p.items as unknown as Item[],
                    arenaData: p.arenaData as unknown as ArenaData | undefined,
                }))
            })),
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
        console.warn("⚠️ Failed to load from DB cache:", error);
        return null;
    }
}
