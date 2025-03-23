import {ChampionMastery} from "@/types/interfaces";
import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";

export async function fetchTopChampionMasteries(server: string, puuid: string, count: number = 10): Promise<ChampionMastery[]> {
    try {
        const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`);
        // Return the complete ChampionMastery objects
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch top champion mastery data:", error);
        throw new Error(`Failed to fetch top champion mastery data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}