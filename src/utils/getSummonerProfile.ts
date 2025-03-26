/**
 * Functions for fetching and formatting League of Legends summoner profiles using Riot API
 * @module summonerProfile
 */

import { calculateWinRatio, getRegion, getServer } from "@/utils/helper";
import { ChampionMastery, FormatResponseReturn, MatchResponse, Ranked, RankedEntry } from "@/types/interfaces";
import { fetchAugmentById } from "@/utils/getAugment";
import {
    fetchMatchDetailsData,
    fetchAccountData,
    fetchSummonerData,
    fetchLeagueData,
    fetchTopChampionMasteries,
    fetchMatchData
} from "@/utils/riotApiRequest";
import { AccountDetails } from "@/utils/riotApiRequest/fetchAccountData";
import { SummonerDetails } from "./riotApiRequest/fetchSummonerData";

/**
 * Enum for standardizing queue types
 */
enum QueueType {
    SOLO = "RANKED_SOLO_5x5",
    FLEX = "RANKED_FLEX_SR"
}

/**
 * Custom error class for handling Riot API related errors
 */
class RiotAPIError extends Error {
    constructor(message: string, public originalError?: Error) {
        super(message);
        this.name = "RiotAPIError";
    }
}

/**
 * Combines account details, summoner details, ranked data, match history,
 * and champion masteries into a single type
 */
type FormattedResponse = AccountDetails & SummonerDetails & Ranked & {
    match: MatchResponse[];
    championMasteries: ChampionMastery[];
};

/**
 * Fetches and compiles complete summoner profile data from Riot API
 *
 * @param serverFetched - The server identifier (e.g., 'na1', 'euw1')
 * @param gameName - The summoner's in-game name
 * @param tagLine - The summoner's tag line (e.g., '#NA1')
 * @param matchCount - How many match details must be fetched, default = 5
 * @returns Formatted summoner profile data or null if an error occurs
 */
export async function getSummonerProfile(
    serverFetched: string,
    gameName: string,
    tagLine: string,
    matchCount = 5
): Promise<FormatResponseReturn | null> {
    try {
        // Convert server code to region and server identifiers
        const region: string = getRegion(serverFetched);
        const server: string = getServer(serverFetched);

        // Fetch account details first as they're required for later calls
        const accountDetails: AccountDetails = await fetchAccountData(region, gameName, tagLine);

        if (!accountDetails || !accountDetails.puuid) {
            console.error("Failed to retrieve account details");
            return null;
        }

        // Fetch summoner details as they're required for league data
        const summonerDetails: SummonerDetails = await fetchSummonerData(server, accountDetails.puuid);

        if (!summonerDetails || !summonerDetails.id) {
            console.error("Failed to retrieve summoner details");
            return null;
        }

        // Fetch remaining data in parallel since they're independent
        const [rankedDataMap, championMasteries, matchIds] = await Promise.all([
            fetchLeagueData(server, summonerDetails.id),
            fetchTopChampionMasteries(server, accountDetails.puuid),
            fetchMatchData(region, accountDetails.puuid, "", matchCount),
            // Cache warming happens in parallel and doesn't block other requests
            fetchAugmentById(1).catch(error => {
                console.warn("Cache warming failed, but continuing:", error);
                return null;
            })
        ]);

        // Fetch match details in parallel
        const match: MatchResponse[] = await Promise.all(
            matchIds.map(matchID =>
                fetchMatchDetailsData(region, server, matchID)
                    .catch(error => {
                        console.warn(`Failed to fetch match ${matchID}:`, error);
                        return null;
                    })
            )
        ).then(results => results.filter(Boolean) as MatchResponse[]);

        // Format all collected data into a standardized response
        return formatResponse({
            ...accountDetails,
            ...summonerDetails,
            ...rankedDataMap,
            match,
            championMasteries: championMasteries || []
        });
    } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error fetching summoner profile for ${gameName}#${tagLine} on ${serverFetched}:`, error);

        // If it's already our custom error type, re-throw it
        if (error instanceof RiotAPIError) {throw error;}

        // Otherwise, wrap it in our custom error
        throw new RiotAPIError(`Failed to get summoner profile: ${errorMessage}`, error instanceof Error ? error : undefined);
    }
}

/**
 * Extracts ranked data for a specific queue type
 *
 * @param entries - Collection of ranked entries
 * @param queueType - The queue type to extract
 * @returns The ranked entry or null if not found
 */
function extractRankedEntry(entries: RankedEntry[] | undefined, queueType: QueueType): RankedEntry | null {
    return entries?.find(entry => entry.queueType === queueType) || null;
}

/**
 * Formats the raw response data into a standardized structure
 * Extracts solo and flex queue ranked data and calculates win ratios
 *
 * @param data - Combined raw data from various API calls
 * @returns Formatted and enhanced summoner profile data
 */
function formatResponse(data: FormattedResponse): FormatResponseReturn {
    // Extract queue specific data using helper function
    const soloEntry = extractRankedEntry(data.entries, QueueType.SOLO);
    const flexEntry = extractRankedEntry(data.entries, QueueType.FLEX);

    // Return formatted data with calculated fields and safe defaults
    return {
        ...data,
        // Solo queue data
        soloTier: soloEntry?.tier || "Unranked",
        soloRank: soloEntry?.rank || "",
        soloWins: soloEntry?.wins || 0,
        soloLosses: soloEntry?.losses || 0,
        soloLP: soloEntry?.leaguePoints || 0,
        soloWR: calculateWinRatio(soloEntry?.wins || 0, soloEntry?.losses || 0),

        // Flex queue data
        flexTier: flexEntry?.tier || "Unranked",
        flexRank: flexEntry?.rank || "",
        flexWins: flexEntry?.wins || 0,
        flexLosses: flexEntry?.losses || 0,
        flexLP: flexEntry?.leaguePoints || 0,
        flexWR: calculateWinRatio(flexEntry?.wins || 0, flexEntry?.losses || 0),

        // Other data
        championMasteries: data.championMasteries || [],
        match: data.match || [],
    };
}