import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";

export async function fetchSummonerData(server: string, puuid: string) {
    const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    return response.json();
}