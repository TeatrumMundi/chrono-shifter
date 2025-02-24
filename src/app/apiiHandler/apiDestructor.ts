﻿const DEFAULT_URL = "http://localhost:3000/api";

type RankData = {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    puuid: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
};
type RankedMap = {
    solo?: RankData;
    flex?: RankData;
};

/**
 * Validates a fetch response and throws an error if the response is not OK.
 *
 * @param {Response} response - The fetch response object to validate.
 * @throws {Error} If the response status is not OK (e.g., 404, 500).
 * @example
 * // Validate a fetch response
 * const response = await fetch("https://api.example.com/data");
 * checkResponse(response);
 */
function checkResponse(response: Response): void {
    if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
    }
}
async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);
        checkResponse(response); // Validate the response
        return await response.json();
    } catch (error) {
        throw error; // Rethrow the original error
    }
}
export async function fetchAccountData(region: string, gameName: string, tagLine: string) {
    return fetchData<{ puuid: string; gameName: string; tagLine: string }>(
        `${DEFAULT_URL}/account/by-riot-id/?region=${region}&gameName=${gameName}&tag=${tagLine}`
    );
}
export async function fetchSummonerData(server: string, puuid: string) {
    return fetchData<{ id: string; profileIconId: string; summonerLevel: string }>(
        `${DEFAULT_URL}/summoner/by-puuid/?server=${server}&puuid=${puuid}`
    );
}
export async function fetchLeagueData(server: string, summonerID: string): Promise<RankedMap> {
    const data = await fetchData<RankData[]>(
        `${DEFAULT_URL}/league/by-summoner?server=${server}&summonerID=${summonerID}`
    );

    return data.reduce<RankedMap>((acc, entry) => {
        if (entry.queueType === "RANKED_SOLO_5x5") {
            acc.solo = entry;
        } else if (entry.queueType === "RANKED_FLEX_SR") {
            acc.flex = entry;
        }
        return acc;
    }, {});
}
export async function fetchMatchData(region: string, puuid: string, queueType?: string, number: number = 5): Promise<string[]> {
    const url = `${DEFAULT_URL}/match/by-puuid/?region=${region}&puuid=${puuid}&number=${number}` +
        (queueType ? `&queueType=${queueType}` : "");

    return fetchData<string[]>(url);
}