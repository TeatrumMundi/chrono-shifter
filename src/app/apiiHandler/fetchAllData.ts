import {
    fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData, fetchMatchDetailsData
} from "./apiDestructor";
import { calculateWinRatio, getRegion, getServer } from "@/app/apiiHandler/helper";
import {FormatResponseReturn, MatchResponse, Ranked} from "@/app/apiiHandler/Interfaces/interfaces";

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
    puuid: string;
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
            matchIds.slice(0, 5).map(async (matchID) => await fetchMatchDetailsData(region, matchID))
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
function formatResponse(data: FormattedResponse): FormatResponseReturn {
    return {
        puuid: data.puuid,
        gameName: data.gameName,
        tagLine: data.tagLine,
        profileIconId: data.profileIconId,
        summonerLevel: data.summonerLevel,
        // Solo/Duo Information
        soloTier: data.rankedDataMap.RankedEntry[0].tier || "Unranked",
        soloRank: data.rankedDataMap.RankedEntry[0].rank || "",
        soloWins: data.rankedDataMap.RankedEntry[0].wins || 0,
        soloLosses: data.rankedDataMap.RankedEntry[0].losses || 0,
        soloLP: data.rankedDataMap.RankedEntry[0].leaguePoints,
        soloWR: calculateWinRatio(data.rankedDataMap.RankedEntry[0].wins, data.rankedDataMap.RankedEntry[0].losses),
        // Flex information
        flexTier: data.rankedDataMap.RankedEntry[1].tier || "Unranked",
        flexRank: data.rankedDataMap.RankedEntry[1].rank || "",
        flexWins: data.rankedDataMap.RankedEntry[1].wins || 0,
        flexLosses: data.rankedDataMap.RankedEntry[1].losses || 0,
        flexLP: data.rankedDataMap.RankedEntry[1].leaguePoints,
        flexWR: calculateWinRatio(data.rankedDataMap.RankedEntry[1].wins, data.rankedDataMap.RankedEntry[1].losses),
        match: data.match,
    };
}