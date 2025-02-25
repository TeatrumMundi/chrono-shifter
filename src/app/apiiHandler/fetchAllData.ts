import {
    fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData, getMatchDetailsData, MatchResponse, ProcessedParticipant
} from "./apiDestructor";
import { calculateWinRatio, getRegion, getServer } from "@/app/apiiHandler/helper";

// Type Definitions
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
interface RankedStats {
    wins: number;
    losses: number;
    tier?: string;
    rank?: string;
    leaguePoints: number;
}
interface RankedData {
    solo?: RankedStats;
    flex?: RankedStats;
}
type MatchData = string[];
type FormattedResponse = AccountDetails & SummonerDetails & {
    rankedDataMap: RankedData;
    matches: MatchData;
    matchDetails: ProcessedParticipant[]; // Add match details
};

export async function fetchAllData(serverFetched: string, gameName: string, tagLine: string) {
    try {
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        const accountDetails: AccountDetails = await fetchAccountData(region, gameName, tagLine);
        const summonerDetails: SummonerDetails = await fetchSummonerData(server, accountDetails.puuid);
        const rankedDataMap: RankedData = await fetchLeagueData(server, summonerDetails.id);
        const matches: MatchData = await fetchMatchData(region, accountDetails.puuid);

        const matchDetails: MatchResponse = await getMatchDetailsData(region, matches[0]);

        return formatResponse({
            ...accountDetails,
            ...summonerDetails,
            rankedDataMap,
            matches,
            matchDetails: matchDetails.participants
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Format Response
function formatResponse(
    {
        gameName, tagLine, profileIconId, summonerLevel, rankedDataMap, matchDetails
    }: FormattedResponse)
{
    const solo = rankedDataMap.solo ?? { wins: 0, losses: 0, leaguePoints: 0 };
    const flex = rankedDataMap.flex ?? { wins: 0, losses: 0, leaguePoints: 0 };

    return {
        gameName,
        tagLine,
        profileIconId,
        summonerLevel,
        soloTier: solo.tier || "Unranked",
        soloRank: solo.rank || "",
        soloWins: solo.wins,
        soloLosses: solo.losses,
        soloLP: solo.leaguePoints,
        soloWR: calculateWinRatio(solo.wins, solo.losses),
        flexTier: flex.tier || "Unranked",
        flexRank: flex.rank || "",
        flexWins: flex.wins,
        flexLosses: flex.losses,
        flexLP: flex.leaguePoints,
        flexWR: calculateWinRatio(flex.wins, flex.losses),
        matchDetails,
    };
}