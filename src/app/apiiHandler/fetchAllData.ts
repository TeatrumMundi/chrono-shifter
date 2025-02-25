import {
    fetchAccountData, fetchLeagueData, fetchMatchData, fetchSummonerData
} from "./apiDestructor";
import { calculateWinRatio, getRegion, getServer } from "@/app/apiiHandler/helper";

// Type Definitions
interface AccountDetails {
    puuid: string;
    fetchedGameName: string;
    fetchedTagLine: string;
}

interface SummonerDetails {
    id: string;
    profileIconID: string;
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
};

// Fetch Account Details
async function fetchAccountDetails(region: string, gameName: string, tagLine: string): Promise<AccountDetails> {
    const { puuid, gameName: fetchedGameName, tagLine: fetchedTagLine } = await fetchAccountData(region, gameName, tagLine);
    return { puuid, fetchedGameName, fetchedTagLine };
}

// Fetch Summoner Details
async function fetchSummonerDetails(server: string, puuid: string): Promise<SummonerDetails> {
    const { id, profileIconId: profileIconID, summonerLevel } = await fetchSummonerData(server, puuid);
    return { id, profileIconID, summonerLevel };
}

// Fetch and Format Data
export async function fetchAllData(serverFetched: string, gameName: string, tagLine: string) {
    try {
        const region = getRegion(serverFetched);
        const server = getServer(serverFetched);

        const accountDetails = await fetchAccountDetails(region, gameName, tagLine);
        const summonerDetails = await fetchSummonerDetails(server, accountDetails.puuid);
        const rankedDataMap = await fetchLeagueData(server, summonerDetails.id);
        const matches = await fetchMatchData(region, accountDetails.puuid);

        return formatResponse({ ...accountDetails, ...summonerDetails, rankedDataMap, matches });
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Format Response
function formatResponse({ puuid, fetchedGameName, fetchedTagLine, profileIconID, summonerLevel, id, rankedDataMap, matches }: FormattedResponse) {
    const solo = rankedDataMap.solo ?? { wins: 0, losses: 0, leaguePoints: 0 };
    const flex = rankedDataMap.flex ?? { wins: 0, losses: 0, leaguePoints: 0 };

    return {
        puuid,
        gameName: fetchedGameName,
        tagLine: fetchedTagLine,
        profileIconID,
        summonerLevel,
        id,
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
        matches,
    };
}
