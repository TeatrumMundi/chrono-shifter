import {fetchFromRiotAPI} from "@/utils/riotApiRequest/fetchFromRiotAPI";

/**
 * Represents account details for a Riot Games player.
 */
export interface AccountDetails {
    /**
     * The unique Player Universally Unique Identifier (PUUID) for the account.
     */
    puuid: string;

    /**
     * The in-game name of the player.
     */
    gameName: string;

    /**
     * The tagline associated with the player's Riot ID (e.g., "EUNE").
     */
    tagLine: string;
}

/**
 * Fetches account data from the Riot Games API based on the player's Riot ID.
 *
 * @param {string} region - The region where the account is located (e.g., "na1", "euw1").
 * @param {string | string[]} gameName - The in-game name of the player.
 * @param {string | string[]} tagLine - The tagline associated with the player's Riot ID.
 * @returns {Promise<AccountDetails>} A promise that resolves to the account data in JSON format.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 */
export async function fetchAccountData(region: string, gameName: string | string[], tagLine: string | string[]): Promise<AccountDetails> {
    const response : Response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return response.json();
}

