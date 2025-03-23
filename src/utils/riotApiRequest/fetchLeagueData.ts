import {Ranked, RankedEntry} from "@/types/interfaces";
import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";

export async function fetchLeagueData(server: string, summonerId: string): Promise<Ranked> {
    try {
        const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`);
        const rankedData: RankedEntry[] = await response.json();

        // Explicitly check the queueType to ensure correct identification
        const soloQueue = rankedData.find(entry => entry.queueType === "RANKED_SOLO_5x5");
        const flexQueue = rankedData.find(entry => entry.queueType === "RANKED_FLEX_SR");

        const allQueues: Ranked = {
            RankedEntry: []
        };

        // Add solo queue data if it exists
        if (soloQueue) {
            allQueues.RankedEntry.push({...soloQueue, queueType: "RANKED_SOLO_5x5"});
        }

        // Add flex queue data if it exists
        if (flexQueue) {
            allQueues.RankedEntry.push({...flexQueue, queueType: "RANKED_FLEX_SR"});
        }

        return allQueues;
    }
    catch (error) {
        throw new Error(`Failed to fetch league data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}