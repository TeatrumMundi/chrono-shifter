import { fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData, fetchMatchDetailsData, fetchTopChampionMasteries } from "./apiDestructor";
import { calculateWinRatio, getRegion, getServer } from "@/utils/helper";
import {ChampionMastery, FormatResponseReturn, MatchResponse, Ranked, RankedEntry} from "@/types/interfaces";

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
type FormattedResponse = AccountDetails & SummonerDetails & Ranked & {
    match: MatchResponse[];
    championMasteries: ChampionMastery[];
};

export async function getSummonerProfile(serverFetched: string, gameName: string, tagLine: string) {
    try {
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        const accountDetails = await fetchAccountData(region, gameName, tagLine);
        const summonerDetails = await fetchSummonerData(server, accountDetails.puuid);
        const rankedDataMap: Ranked = await fetchLeagueData(server, summonerDetails.id);
        const match: MatchResponse[] = await Promise.all(
            (await fetchMatchData(region, accountDetails.puuid, "", 100)).slice(0, 5).map(matchID =>
                fetchMatchDetailsData(region, matchID)
            )
        );

        // Fetch top champion masteries (default is 10)
        const championMasteries = await fetchTopChampionMasteries(server, accountDetails.puuid);

        return formatResponse({ ...accountDetails, ...summonerDetails, ...rankedDataMap, match, championMasteries });
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function formatResponse(data: FormattedResponse): FormatResponseReturn {
    const soloEntry : RankedEntry = data.RankedEntry[0];
    const flexEntry : RankedEntry = data.RankedEntry[1];

    return {
        ...data,
        soloTier: soloEntry.tier || "Unranked",
        soloRank: soloEntry.rank || "",
        soloWins: soloEntry.wins || 0,
        soloLosses: soloEntry.losses || 0,
        soloLP: soloEntry.leaguePoints,
        soloWR: calculateWinRatio(soloEntry.wins, soloEntry.losses),
        flexTier: flexEntry.tier || "Unranked",
        flexRank: flexEntry.rank || "",
        flexWins: flexEntry.wins || 0,
        flexLosses: flexEntry.losses || 0,
        flexLP: flexEntry.leaguePoints,
        flexWR: calculateWinRatio(flexEntry.wins, flexEntry.losses),
        championMasteries: data.championMasteries || [],
    };
}
