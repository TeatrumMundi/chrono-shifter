import { ChampionMastery } from "@/types/interfaces";
import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";

/**
 * Fetches the top champion masteries for a given player from the Riot Games API.
 *
 * @param {string} server - The server where the player's account is located (e.g., "na1", "euw1").
 * @param {string} puuid - The unique Player Universally Unique Identifier (PUUID) of the player.
 * @param {number} [count=10] - The number of top champion masteries to fetch (defaults to 10).
 * @returns {Promise<ChampionMastery[]>} A promise that resolves to an array of ChampionMastery objects, each representing a champion mastery.
 *
 * @throws {Error} Throws an error if the request to the Riot API fails or if the response cannot be processed.
 */
export async function fetchTopChampionMasteries(server: string, puuid: string, count: number = 10): Promise<ChampionMastery[]> {
    try {
        // Fetch the top champion mastery data from the Riot API
        const response : Response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`);

        // Ensure the response is valid and return the complete ChampionMastery objects
        return await response.json();
    } catch (error) {throw new Error(`Failed to fetch top champion mastery data: ${error instanceof Error ? error.message : "Unknown error"}`);}
}
