import {
    fetchAccountInfo, fetchLeagueInfo,
    fetchSummonerInfo
} from "./apiDestructor";

export async function fetchAllData(server: string, gameName: string, tagLine: string) {
    try {
        const [puuid, fetchedGameName, fetchedTagLine] = await fetchAccountInfo("europe", gameName, tagLine);
        const [id, profileIconID, summonerLevel] = await fetchSummonerInfo(server, puuid);
        const rankedDataMap = await fetchLeagueInfo(server, id);

        // Ensure wins/losses default to 0 if undefined
        const soloWins = rankedDataMap.solo?.wins ?? 0;
        const soloLosses = rankedDataMap.solo?.losses ?? 0;
        const flexWins = rankedDataMap.flex?.wins ?? 0;
        const flexLosses = rankedDataMap.flex?.losses ?? 0;

        // Calculate win ratios
        const soloWR = winRatio(soloWins, soloLosses);
        const flexWR = winRatio(flexWins, flexLosses);

        return {
            puuid,
            gameName: fetchedGameName,
            tagLine: fetchedTagLine,
            profileIconID,
            summonerLevel,
            id,
            soloTier: rankedDataMap.solo?.tier || "Unranked",
            soloRank: rankedDataMap.solo?.rank || "",
            soloWins,
            soloLosses,
            soloWR,
            flexTier: rankedDataMap.flex?.tier || "Unranked",
            flexRank: rankedDataMap.flex?.rank || "",
            flexWins,
            flexLosses,
            flexWR
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function winRatio(wins: number, losses: number): number {
    // If there are no losses and at least one win, return 100% win ratio
    if (losses === 0 && wins > 0) return 100;

    // If there are no wins, return 0% win ratio
    if (wins === 0) return 0;

    // Calculate the win ratio as a percentage
    const ratio = (wins / (wins + losses)) * 100;

    // Round the result to a maximum of two decimal places and return it as a number
    return parseFloat(ratio.toFixed(2));
}
