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
import {FormatResponseReturn, MatchResponse, RankedInfo} from "@/types/ProcessedInterfaces";

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
    matchCount = 5
): Promise<FormatResponseReturn | null> {
    try {
        // Step 1: Resolve region/server from shorthand
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        // Step 2: Fetch account data by Riot ID (gameName + tagLine)
        const accountDetails = await fetchAccountData(region, gameName, tagLine);
        if (!accountDetails?.puuid) {console.error("❌ Account details not found for:", gameName, tagLine);
            return null;
        }

        // Step 3: Fetch summoner data using PUUID
        const summonerDetails = await fetchSummonerData(server, accountDetails.puuid);
        if (!summonerDetails?.id) {
            console.error("❌ Summoner details not found for PUUID:", accountDetails.puuid);
            return null;
        }

        // Step 4: Fetch ranked info, top champion masteries, match history in parallel
        const [rankedDataMap, championMasteries, matchIds] = await Promise.all([
            fetchLeagueData(server, summonerDetails.id),
            fetchTopChampionMasteries(server, accountDetails.puuid),
            fetchMatchData(region, accountDetails.puuid, "", matchCount),
            // Step 4.1 (non-blocking): Cache warm-up (fail-safe)
            getAugmentById(1).catch(error => {
                console.warn("⚠️ Cache warming failed (non-blocking):", error);
                return null;
            })
        ]);

        // Step 5: Fetch full match details in parallel for each match ID
        const match = await Promise.all(
            matchIds.map(id =>
                fetchMatchDetailsData(region, server, id).catch(err => {
                    console.warn(`⚠️ Failed to fetch match ${id}:`, err);
                    return null;
                })
            )
        ).then(results => results.filter(Boolean) as MatchResponse[]);

        // Step 6: Extract solo and flex ranked entries
        const soloRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.SOLO) || null
        );

        const flexRanked = formatRankedStats(
            rankedDataMap.entries?.find(entry => entry.queueType === QueueType.FLEX) || null
        );

        // Step 7: Return compiled profile response
        return {
            ...accountDetails,
            ...summonerDetails,
            ...rankedDataMap,
            server,
            entries: rankedDataMap.entries,

            // Step 7.1: Solo Queue stats
            soloRanked,

            // Step 7.2: Flex Queue stats
            flexRanked,

            // Step 7.3: Extras
            championMasteries: championMasteries || [],
            match: match || []
        };
    } catch (error) {
        // Step 8: Global error handling and wrapping
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error(`🔥 Error fetching summoner profile (${gameName}#${tagLine} @ ${serverFetched}):`, error);

        if (error instanceof RiotAPIError) throw error;
        throw new RiotAPIError(`Failed to get summoner profile: ${msg}`, error instanceof Error ? error : undefined);
    }
}
