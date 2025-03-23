import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";

export async function fetchMatchData(region: string, puuid: string, queueType?: string, number: number = 5): Promise<string[]> {
    let url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${number}`;

    if (queueType) {
        url += `&queue=${queueType}`;
    }

    const response = await fetchFromRiotAPI(url);
    return response.json();
}