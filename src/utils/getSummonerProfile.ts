// Refactored version of getSummonerProfile
import {
    fetchAccountData,
    fetchSummonerData,
    fetchLeagueData,
    fetchTopChampionMasteries,
    fetchMatchData,
    fetchMatchDetailsData
} from "@/utils/riotApiRequest";
import {
    calculateWinRatio,
    getRegion,
    getServer
} from "@/utils/helper";
import { normalizeServerName } from "@/utils/normalizeServerName";
import { saveSummonerProfileToDB } from "@/utils/saveSummonerProfileToDB";
import { getCachedProfileFromDB } from "@/utils/getSummonerProfileFromDB";
import { isMatchInDB } from "@/utils/DataBase/isMatchInDB";
import { getMatchFromDB } from "@/utils/DataBase/getMatchFromDB";
import { getAugmentById } from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAugmentObject";
import { FormatResponseReturn, MatchResponse, RankedInfo } from "@/types/ProcessedInterfaces";
import { RawRankedEntry } from "@/types/RawInterfaces";

async function measureTime<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
    return result;
}

function formatRankedStats(entry: RawRankedEntry | null): RankedInfo {
    return {
        Tier: entry?.tier || "Unranked",
        Rank: entry?.rank || "",
        Wins: entry?.wins || 0,
        Losses: entry?.losses || 0,
        LP: entry?.leaguePoints || 0,
        WR: calculateWinRatio(entry?.wins || 0, entry?.losses || 0)
    };
}

function logStart(gameName: string, tagLine: string, region: string, server: string, serverFetched: string) {
    console.log("\x1b[35m");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                 🔄 Loading player profile...               ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\x1b[0m");
    console.log(`🆔 Nickname:        \x1b[36m${gameName.toUpperCase()}#${tagLine.toUpperCase()}\x1b[0m`);
    console.log(`🖥️  Server:          \x1b[33m${server.toUpperCase()}\x1b[0m`);
    console.log(`📡 Fetched Server:  \x1b[33m${serverFetched.toUpperCase()}\x1b[0m`);
    console.log(`🌐 Region:          \x1b[33m${region.toUpperCase()}\x1b[0m\n`);
}

async function fetchMatches(region: string, server: string, puuid: string, matchCount: number): Promise<MatchResponse[]> {
    const matchIds = await measureTime("fetchMatchData", () =>
        fetchMatchData(region, puuid, "", matchCount)
    );

    const matches = await Promise.all(
        matchIds.map(async id => {
            const exists = await isMatchInDB(id);
            if (exists) {
                console.log(`📦 Loading match ${id} from DB`);
                return getMatchFromDB(id);
            }

            return measureTime(`fetchMatchDetailsData(${id})`, () =>
                fetchMatchDetailsData(region, server, id).catch(err => {
                    console.warn(`⚠️ Failed to fetch match ${id}:`, err + "\n");
                    return null;
                })
            );
        })
    );

    return matches.filter(Boolean) as MatchResponse[];
}

export async function getSummonerProfile(
    serverFetched: string,
    gameName: string,
    tagLine: string,
    matchCount = 5,
    force = false,
    includeMatches = false,
    explicitUpdate = false
): Promise<FormatResponseReturn | null> {
    try {
        const normalized = normalizeServerName(serverFetched);
        const region = getRegion(normalized);
        const server = getServer(normalized);

        logStart(gameName, tagLine, region, server, serverFetched);

        const cached = await getCachedProfileFromDB(gameName, tagLine, server);
        if (cached && !force) {
            console.log("\x1b[36m");
            console.log("┌────────────────────────────────────────────────────────┐");
            console.log("│ 📦 CACHE HIT: PROFILE LOADED FROM DATABASE             │");
            console.log("└────────────────────────────────────────────────────────┘");
            console.log("\x1b[0m\n");
            return {
                ...cached,
                match: [],
                playerInfo: {
                    ...cached.playerInfo,
                    lastUpdatedAt: cached.playerInfo.lastUpdatedAt,
                },
            };
        }

        const accountDetails = await measureTime("fetchAccountData", () =>
            fetchAccountData(region, gameName, tagLine)
        );
        if (!accountDetails?.puuid) return null;

        const summonerDetails = await measureTime("fetchSummonerData", () =>
            fetchSummonerData(server, accountDetails.puuid)
        );
        if (!summonerDetails?.id) return null;

        const [rankedDataMap, championMasteries] = await Promise.all([
            measureTime("fetchLeagueData", () => fetchLeagueData(server, summonerDetails.id)),
            measureTime("fetchTopChampionMasteries", () => fetchTopChampionMasteries(server, accountDetails.puuid)),
            getAugmentById(1).catch(() => null) // cache warming, non-blocking
        ]);

        const soloRanked = formatRankedStats(
            rankedDataMap.entries?.find(e => e.queueType === "RANKED_SOLO_5x5") || null
        );
        const flexRanked = formatRankedStats(
            rankedDataMap.entries?.find(e => e.queueType === "RANKED_FLEX_SR") || null
        );

        const match = includeMatches && (force || !cached) ? await fetchMatches(region, server, accountDetails.puuid, matchCount) : [];

        const response: FormatResponseReturn = {
            playerInfo: {
                puuid: accountDetails.puuid,
                gameName: accountDetails.gameName,
                tagLine: accountDetails.tagLine,
                server,
                profileIconId: Number(summonerDetails.profileIconId),
                summonerLevel: Number(summonerDetails.summonerLevel),
                lastUpdatedAt: new Date(),
            },
            soloRanked,
            flexRanked,
            entries: rankedDataMap.entries,
            championMasteries: championMasteries || [],
            match
        };

        console.log("\x1b[32m");
        console.log("┌────────────────────────────────────────────────────────┐");
        console.log("│ ✅ SUCCESS: FETCHED LIVE PROFILE FROM RIOT API         │");
        console.log("└────────────────────────────────────────────────────────┘");
        console.log("\x1b[0m\n");

        await saveSummonerProfileToDB(response, explicitUpdate);
        return response;
    } catch (error) {
        console.error("🔥 Error fetching profile:", error);
        return null;
    }
}