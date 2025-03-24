import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";

/**
 * Represents summoner details for a Riot Games player.
 */
export interface SummonerDetails {
    /**
     * The unique summoner ID assigned by Riot Games.
     */
    id: string;

    /**
     * The ID of the summoner's profile icon.
     */
    profileIconId: string;

    /**
     * The summoner's level in the game.
     */
    summonerLevel: string;
}

/**
 * Fetches summoner data from the Riot Games API using the player's PUUID.
 *
 * @param {string} server - The server region where the summoner is located (e.g., "na1", "euw1").
 * @param {string} puuid - The unique PUUID (Player Universally Unique Identifier) of the summoner.
 * @returns {Promise<SummonerDetails>} A promise that resolves to the summoner data in JSON format.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 */
export async function fetchSummonerData(server: string, puuid: string): Promise<SummonerDetails> {
    const response : Response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    return response.json();
}
