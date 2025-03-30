/**
 * Fetches and formats a complete League of Legends summoner profile from Riot API
 * Includes account details, ranked info, match history, and champion masteries
 */

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
import {isMatchInDB} from "@/utils/DataBase/isMatchInDB";
import {getMatchFromDB} from "@/utils/DataBase/getMatchFromDB";

// Measure execution time of async function
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
    force = false
): Promise<FormatResponseReturn | null> {
    try {
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        if (!force) {
            const cached = await getCachedProfileFromDB(gameName, tagLine, server);
            if (cached) {
                console.log(`✅ Serving cached profile for ${gameName}#${tagLine} from DB\n`);
                return cached;
            }
        }

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

        const [rankedDataMap, championMasteries, matchIds] = await Promise.all([
            measureTime("fetchLeagueData", () => fetchLeagueData(server, summonerDetails.id)),
            measureTime("fetchTopChampionMasteries", () => fetchTopChampionMasteries(server, accountDetails.puuid)),
            measureTime("fetchMatchData", () => fetchMatchData(region, accountDetails.puuid, "", matchCount)),
            getAugmentById(1).catch(error => {
                console.warn("⚠️ Cache warming failed (non-blocking):", error + "\n");
                return null;
            })
        ]);

        const match = await Promise.all(
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

        const soloRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.SOLO) || null
        );

        const flexRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.FLEX) || null
        );

        const response = {
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
            match: match || []
        };

        console.log(`🌐 Fetched live profile for ${gameName}#${tagLine} from Riot API\n`);

        await saveSummonerProfileToDB(response);

        return response;
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error(`🔥 Error fetching summoner profile (${gameName}#${tagLine} @ ${serverFetched}):`, error + "\n");

        if (error instanceof RiotAPIError) throw error;
        throw new RiotAPIError(`Failed to get summoner profile: ${msg}`, error instanceof Error ? error : undefined);
    }
}