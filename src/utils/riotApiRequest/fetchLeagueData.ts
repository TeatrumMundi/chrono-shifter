import { Ranked, RankedEntry } from "@/types/interfaces";
import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";

/**
 * Fetches ranked league data for a summoner from the Riot Games API.
 *
 * @param {string} server - The server region where the summoner is located (e.g., "na1", "euw1").
 * @param {string} summonerId - The unique summoner ID used to retrieve ranked data.
 * @returns {Promise<Ranked>} A promise that resolves to the summoner's ranked data.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 */
export async function fetchLeagueData(server: string, summonerId: string): Promise<Ranked> {
    try {
        const response: Response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`);
        const rankedData: RankedEntry[] = await response.json();

        // This code snippet transforms an array of ranked data (`rankedData`) into a map (object) for efficient lookup.
        const rankedMap = rankedData.reduce((acc, entry) => {
            acc[entry.queueType] = entry;
            return acc;
        }, {} as Record<string, RankedEntry>);

        return {
            entries: [
                ...(rankedMap["RANKED_SOLO_5x5"] ? [rankedMap["RANKED_SOLO_5x5"]] : []),
                ...(rankedMap["RANKED_FLEX_SR"] ? [rankedMap["RANKED_FLEX_SR"]] : [])
            ]
        };
    } catch (error) {throw new Error("Failed to fetch league data", { cause: error });}
}