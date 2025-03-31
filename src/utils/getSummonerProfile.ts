import { calculateWinRatio, getRegion, getServer } from "@/utils/helper";
import {
    fetchAccountData,
    fetchSummonerData,
    fetchLeagueData,
    fetchTopChampionMasteries,
    fetchMatchData,
    fetchMatchDetailsData
} from "@/utils/riotApiRequest";
import { getAugmentById } from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAugmentObject";
import { RawRankedEntry } from "@/types/RawInterfaces";
import { FormatResponseReturn, MatchResponse, RankedInfo } from "@/types/ProcessedInterfaces";
import { saveSummonerProfileToDB } from "@/utils/saveSummonerProfileToDB";
import { getCachedProfileFromDB } from "@/utils/getSummonerProfileFromDB";
import { isMatchInDB } from "@/utils/DataBase/isMatchInDB";
import { getMatchFromDB } from "@/utils/DataBase/getMatchFromDB";
import {normalizeServerName} from "@/utils/normalizeServerName";

async function measureTime<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
    return result;
}

enum QueueType {
    SOLO = "RANKED_SOLO_5x5",
    FLEX = "RANKED_FLEX_SR"
}

class RiotAPIError extends Error {
    constructor(message: string, public originalError?: Error) {
        super(message);
        this.name = "RiotAPIError";
    }
}

function formatRankedStats(entry: RawRankedEntry | null): RankedInfo {
    return {
        Tier: entry?.tier || "Unranked",
        Rank: entry?.rank || "",
        Wins: entry?.wins || 0,
        Losses: entry?.losses || 0,
        LP: entry?.leaguePoints || 0,
        WR: calculateWinRatio(entry?.wins || 0, entry?.losses || 0),
    };
}

export async function getSummonerProfile(
    serverFetched: string,
    gameName: string,
    tagLine: string,
    matchCount = 5,
    force = false,
    includeMatches = false
): Promise<FormatResponseReturn | null> {
    try {
        console.clear();

        console.log("\x1b[35m");
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║                 🔄 Loading player profile...               ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
        console.log("\x1b[0m");

        const normalized = normalizeServerName(serverFetched);
        const region = getRegion(normalized);
        const server = getServer(normalized);

        console.log(`🆔 Nickname:        \x1b[36m${gameName.toUpperCase()}#${tagLine.toUpperCase()}\x1b[0m`);
        console.log(`🖥️  Server:          \x1b[33m${server.toUpperCase()}\x1b[0m`);
        console.log(`📡 Fetched Server:  \x1b[33m${serverFetched.toUpperCase()}\x1b[0m`);
        console.log(`🌐 Region:          \x1b[33m${region.toUpperCase()}\x1b[0m\n`);

        let shouldFetch = force;
        const cached = await getCachedProfileFromDB(gameName, tagLine, server);

        if (cached && !force) {
            console.log("\x1b[36m");
            console.log("┌────────────────────────────────────────────────────────┐");
            console.log("│ 📦 CACHE HIT: PROFILE LOADED FROM DATABASE             │");
            console.log("└────────────────────────────────────────────────────────┘");
            console.log(`🧑 Player:  ${gameName.toUpperCase()}#${tagLine.toUpperCase()}`);
            console.log("💾 Source: Internal DB cache");
            console.log("\x1b[0m\n");
            return { ...cached, match: [] };
        }

        if (!cached) {
            shouldFetch = true;
        }

        if (!shouldFetch) return null;

        const accountDetails = await measureTime("fetchAccountData", () =>
            fetchAccountData(region, gameName, tagLine)
        );

        if (!accountDetails?.puuid) {
            console.error(`❌ Account details not found for: Nickname#TAG:${gameName}#${tagLine} Server:${server} Region:${region} ServerFetched:${serverFetched}`);
            return null;
        }

        const summonerDetails = await measureTime("fetchSummonerData", () =>
            fetchSummonerData(server, accountDetails.puuid)
        );

        if (!summonerDetails?.id) {
            console.error("❌ Summoner details not found for PUUID:", accountDetails.puuid + "\n");
            return null;
        }

        const [rankedDataMap, championMasteries] = await Promise.all([
            measureTime("fetchLeagueData", () => fetchLeagueData(server, summonerDetails.id)),
            measureTime("fetchTopChampionMasteries", () => fetchTopChampionMasteries(server, accountDetails.puuid)),
            getAugmentById(1).catch(error => {
                console.warn("⚠️ Cache warming failed (non-blocking):", error + "\n");
                return null;
            })
        ]);

        const shouldIncludeMatches = includeMatches && shouldFetch;
        let match: MatchResponse[] = [];

        if (shouldIncludeMatches) {
            const matchIds = await measureTime("fetchMatchData", () =>
                fetchMatchData(region, accountDetails.puuid, "", matchCount)
            );

            match = await Promise.all(
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
            ).then(results => results.filter(Boolean) as MatchResponse[]);
        }

        const soloRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.SOLO) || null
        );

        const flexRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.FLEX) || null
        );

        const response: FormatResponseReturn = {
            playerInfo: {
                puuid: accountDetails.puuid,
                gameName: accountDetails.gameName,
                tagLine: accountDetails.tagLine,
                server,
                profileIconId: Number(summonerDetails.profileIconId),
                summonerLevel: Number(summonerDetails.summonerLevel),
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
        console.log(`🧑 Player:  ${gameName.toUpperCase()}#${tagLine.toUpperCase()}`);
        console.log("🌐 Source: Riot Games API");
        console.log("\x1b[0m\n");

        await saveSummonerProfileToDB(response);

        return response;
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error(`🔥 Error fetching summoner profile (${gameName}#${tagLine} @ ${serverFetched}):`, error + "\n");

        if (error instanceof RiotAPIError) throw error;
        throw new RiotAPIError(`Failed to get summoner profile: ${msg}`, error instanceof Error ? error : undefined);
    }
}
