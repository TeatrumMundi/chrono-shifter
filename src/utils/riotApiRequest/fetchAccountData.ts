import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";

export async function fetchAccountData(region: string, gameName: string | string[], tagLine: string | string[]) {
    const response : Response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return response.json();
}