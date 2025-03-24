import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";

/**
 * Fetches match data for a player from the Riot Games API based on their PUUID.
 *
 * @param {string} region - The region where the player's account is located (e.g., "EUROPE", "ASIA").
 * @param {string} puuid - The unique Player Universally Unique Identifier (PUUID) of the player.
 * @param {string} [queueType] - An optional queue type filter (e.g., "RANKED_SOLO_5x5", "ARAM").
 * @param {number} [number=5] - The number of match IDs to fetch (defaults to 5).
 * @returns {Promise<string[]>} A promise that resolves to a list of match IDs.
 *
 * @throws {Error} Throws an error if the request to the Riot API fails.
 */
export async function fetchMatchData(
    region: string,
    puuid: string,
    queueType?: string,
    number: number = 5
): Promise<string[]> {
    // Construct the base URL with query parameters for number of matches to fetch
    let url : string = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${number}`;

    // If queueType is provided, append it as a query parameter to filter matches by queue type
    if (queueType) { url += `&queue=${queueType}`; }

    // Fetch data from Riot API using the constructed URL
    const response : Response = await fetchFromRiotAPI(url);

    // Ensure proper error handling for non-OK responses
    if (!response.ok) {throw new Error(`Failed to fetch match data: ${response.statusText}`);}

    // Return the match IDs in JSON format
    return response.json();
}