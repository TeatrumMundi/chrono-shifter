import {
    fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData, getMatchDetailsData
} from "./apiDestructor";
import { calculateWinRatio, getRegion, getServer } from "@/app/apiiHandler/helper";
import {MatchResponse, Ranked} from "@/app/apiiHandler/Interfaces/interfaces";

interface AccountDetails {
    puuid: string;
    gameName: string;
    tagLine: string;
}
interface SummonerDetails {
    id: string;
    profileIconId: string;
    summonerLevel: string;
}
type FormattedResponse = AccountDetails & SummonerDetails & {
    gameName: string;
    tagLine: string;
    profileIconId: string;
    summonerLevel: string;
    rankedDataMap: Ranked;
    match: MatchResponse[];
};

export async function fetchAllData(serverFetched: string, gameName: string, tagLine: string) {
    try {
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        const accountDetails = await fetchAccountData(region, gameName, tagLine);
        const summonerDetails = await fetchSummonerData(server, accountDetails.puuid);
        const rankedDataMap : Ranked = await fetchLeagueData(server, summonerDetails.id);
        const matchIds = await fetchMatchData(region, accountDetails.puuid, "", 100);

        // Fetch multiple matches
        const match: MatchResponse[] = await Promise.all(
            matchIds.slice(0, 5).map(async (matchID) => await getMatchDetailsData(region, matchID))
        );

        return formatResponse({
            ...accountDetails,
            ...summonerDetails,
            rankedDataMap,
            match,
        });
    }
    catch (error)
    {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Format Response
function formatResponse({
                            gameName, tagLine, profileIconId, summonerLevel, match, rankedDataMap
                        }: FormattedResponse) {
    return {
        gameName,
        tagLine,
        profileIconId,
        summonerLevel,
        // Solo/Duo Information
        soloTier: rankedDataMap.RankedEntry[0].tier || "Unranked",
        soloRank: rankedDataMap.RankedEntry[0].rank || "",
        soloWins: rankedDataMap.RankedEntry[0].wins || 0,
        soloLosses: rankedDataMap.RankedEntry[0].losses || 0,
        soloLP: rankedDataMap.RankedEntry[0].leaguePoints,
        soloWR: calculateWinRatio(rankedDataMap.RankedEntry[0].wins, rankedDataMap.RankedEntry[0].losses),
        // Flex information
        flexTier: rankedDataMap.RankedEntry[1].tier || "Unranked",
        flexRank: rankedDataMap.RankedEntry[1].rank || "",
        flexWins: rankedDataMap.RankedEntry[1].wins || 0,
        flexLosses: rankedDataMap.RankedEntry[1].losses || 0,
        flexLP: rankedDataMap.RankedEntry[1].leaguePoints,
        flexWR: calculateWinRatio(rankedDataMap.RankedEntry[1].wins, rankedDataMap.RankedEntry[1].losses),
        match,
    };
}