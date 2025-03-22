import { fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData, fetchMatchDetailsData, fetchTopChampionMasteries } from "./riotApiRequests";
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
        const region : string = getRegion(serverFetched);
        const server : string = getServer(serverFetched);

        const accountDetails = await fetchAccountData(region, gameName, tagLine);
        const summonerDetails = await fetchSummonerData(server, accountDetails.puuid);
        const rankedDataMap: Ranked = await fetchLeagueData(server, summonerDetails.id);
        const championMasteries: ChampionMastery[] = await fetchTopChampionMasteries(server, accountDetails.puuid);
        const match: MatchResponse[] = await Promise.all(
            (await fetchMatchData(region, accountDetails.puuid, "", 100)).slice(0, 5).map(matchID =>
                fetchMatchDetailsData(region, server, matchID)
            )
        );

        return formatResponse({ ...accountDetails, ...summonerDetails, ...rankedDataMap, match, championMasteries });
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function formatResponse(data: FormattedResponse): FormatResponseReturn {
    // Find entries by their queueType rather than array position
    const soloEntry: RankedEntry | null =
        data.RankedEntry?.find(entry => entry.queueType === "RANKED_SOLO_5x5") || null;
    const flexEntry: RankedEntry | null =
        data.RankedEntry?.find(entry => entry.queueType === "RANKED_FLEX_SR") || null;

    return {
        ...data,
        soloTier: soloEntry?.tier || "Unranked",
        soloRank: soloEntry?.rank || "",
        soloWins: soloEntry?.wins || 0,
        soloLosses: soloEntry?.losses || 0,
        soloLP: soloEntry?.leaguePoints || 0,
        soloWR: calculateWinRatio(soloEntry?.wins || 0, soloEntry?.losses || 0),
        flexTier: flexEntry?.tier || "Unranked",
        flexRank: flexEntry?.rank || "",
        flexWins: flexEntry?.wins || 0,
        flexLosses: flexEntry?.losses || 0,
        flexLP: flexEntry?.leaguePoints || 0,
        flexWR: calculateWinRatio(flexEntry?.wins || 0, flexEntry?.losses || 0),
        championMasteries: data.championMasteries || [],
    };
}