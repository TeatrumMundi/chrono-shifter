import {
    fetchAccountInfo, fetchLeagueInfo, fetchMatchList,
    fetchSummonerInfo
} from "./apiDestructor";

const regionMAP: Record<string, string> = {
    NA: "AMERICAS", BR: "AMERICAS", LAN: "AMERICAS", LAS: "AMERICAS",
    EUW: "EUROPE", EUNE: "EUROPE", RU: "EUROPE", TR: "EUROPE",
    KR: "ASIA", JP: "ASIA", VN: "ASIA", ME: "ASIA",
    OCE: "SEA", SEA: "SEA", TW: "SEA",
};
const serverMAP: Record<string, string> = {
    EUNE: "EUN1", EUW: "EUN2",
    JP: "JP1", KR: "KR",
    LAN: "LA1", LAS: "LA2", ME: "ME1",
    NA: "NA1", OCE: "OC1", RU: "RU",
    SEA: "SG2", TR: "TR1", TW: "TW2", VN: "VN2",
};

// Fetch PUUID, gameName, tagLine
async function fetchAccountDetails(region: string, gameName: string, tagLine: string): Promise<AccountDetails> {
    const [puuid, fetchedGameName, fetchedTagLine] = await fetchAccountInfo(region, gameName, tagLine);
    return { puuid, fetchedGameName, fetchedTagLine };
}
async function fetchSummonerDetails(server: string, puuid: string): Promise<SummonerDetails> {
    const [id, profileIconID, summonerLevel] = await fetchSummonerInfo(server, puuid);
    return { id, profileIconID, summonerLevel };
}
type AccountDetails = {
    puuid: string;
    fetchedGameName: string;
    fetchedTagLine: string;
}; // PUUID, gameName, tagLine
type SummonerDetails = {
    id: string;
    profileIconID: string;
    summonerLevel: string;
}; // ID, profileIconID, summonerLVL
type RankedData = {
    solo?: { wins: number; losses: number; tier?: string; rank?: string };
    flex?: { wins: number; losses: number; tier?: string; rank?: string };
}; // Wins, Losses, Tier, Rank for flex and solo/duo
type MatchData = string[]; // List of matches
type FormatResponseParams = AccountDetails & SummonerDetails & { rankedDataMap: RankedData; matches: MatchData };

function getRegion(server: string): string {return regionMAP[server] || "UNKNOWN";} //Returns region suitable for API
function getServer(server: string): string {return serverMAP[server] || "UNKNOWN";} //Returns server suitable for API

function calculateWinRatio(wins: number, losses: number): number {
    if (losses === 0 && wins > 0) return 100;
    if (wins === 0) return 0;
    return parseFloat(((wins / (wins + losses)) * 100).toFixed(0));
} // Calculate winRatio based on wins and loses
export async function fetchAllData(server_fetched: string, gameName: string, tagLine: string) {
    try
    {
        const region = getRegion(server_fetched);
        const server = getServer(server_fetched);

        const accountDetails: AccountDetails = await fetchAccountDetails(region, gameName, tagLine);
        const summonerDetails: SummonerDetails = await fetchSummonerDetails(server, accountDetails.puuid);
        const rankedDataMap: RankedData = await fetchLeagueInfo(server, summonerDetails.id);
        const matches: string[] = await fetchMatchList(region, accountDetails.puuid);

        return formatResponse({ ...accountDetails, ...summonerDetails, rankedDataMap, matches });
    }
    catch (error)
    {
        console.error("Error fetching data:", error);
        return null;
    }
}
function formatResponse({ puuid, fetchedGameName, fetchedTagLine, profileIconID, summonerLevel, id, rankedDataMap, matches }: FormatResponseParams) {
    const soloWins = rankedDataMap.solo?.wins ?? 0;
    const soloLosses = rankedDataMap.solo?.losses ?? 0;
    const flexWins = rankedDataMap.flex?.wins ?? 0;
    const flexLosses = rankedDataMap.flex?.losses ?? 0;

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
        soloWR: calculateWinRatio(soloWins, soloLosses),
        flexTier: rankedDataMap.flex?.tier || "Unranked",
        flexRank: rankedDataMap.flex?.rank || "",
        flexWins,
        flexLosses,
        flexWR: calculateWinRatio(flexWins, flexLosses),
        matches
    };
}
