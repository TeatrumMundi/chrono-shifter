import {fetchData} from "@/app/apiiHandler/helper";

const DEFAULT_URL = "http://localhost:3000/api";

type RankData = {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    puuid: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
};
type RankedMap = {
    solo?: RankData;
    flex?: RankData;
};
interface RuneSelection {
    perk: number;
}
interface RuneStyle {
    selections: RuneSelection[];
}
interface Participant {
    puuid: string;
    kills: number;
    deaths: number;
    assists: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    totalDamageDealtToChampions: number;
    goldEarned: number;
    wardsPlaced?: number;
    totalMinionsKilled: number;
    perks?: {
        styles: RuneStyle[];
    };
}
interface MatchData {
    info: {
        participants: Participant[];
    };
}
export interface ProcessedParticipant {
    puuid: string;
    kills: number;
    deaths: number;
    assists: number;
    items: number[];
    damageDealt: number;
    goldEarned: number;
    wardsPlaced: number;
    minionsKilled: number;
    runes: number[];
}
export interface MatchResponse {
    participants: ProcessedParticipant[];
}
export async function fetchAccountData(region: string, gameName: string, tagLine: string) {
    return fetchData<{ puuid: string; gameName: string; tagLine: string }>(
        `${DEFAULT_URL}/account/by-riot-id/?region=${region}&gameName=${gameName}&tag=${tagLine}`
    );
}
export async function fetchSummonerData(server: string, puuid: string) {
    return fetchData<{ id: string; profileIconId: string; summonerLevel: string }>(
        `${DEFAULT_URL}/summoner/by-puuid/?server=${server}&puuid=${puuid}`
    );
}
export async function fetchLeagueData(server: string, summonerID: string): Promise<RankedMap> {
    const data = await fetchData<RankData[]>(
        `${DEFAULT_URL}/league/by-summoner?server=${server}&summonerID=${summonerID}`
    );

    return data.reduce<RankedMap>((acc, entry) => {
        if (entry.queueType === "RANKED_SOLO_5x5") {
            acc.solo = entry;
        } else if (entry.queueType === "RANKED_FLEX_SR") {
            acc.flex = entry;
        }
        return acc;
    }, {});
}
export async function fetchMatchData(region: string, puuid: string, queueType?: string, number: number = 5): Promise<string[]> {
    const url = `${DEFAULT_URL}/match/by-puuid/?region=${region}&puuid=${puuid}&number=${number}` +
        (queueType ? `&queueType=${queueType}` : "");

    return fetchData<string[]>(url);
}
export async function getMatchDetailsData(region: string, matchID: string): Promise<MatchResponse> {
    const url = `${DEFAULT_URL}/match/by-matchId/?region=${region}&matchID=${matchID}`;

    try {
        const data: MatchData = await fetchData<MatchData>(url);

        const participants: ProcessedParticipant[] = data.info.participants.map((participant) => ({
            puuid: participant.puuid,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            items: [
                participant.item0,
                participant.item1,
                participant.item2,
                participant.item3,
                participant.item4,
                participant.item5,
            ],
            damageDealt: participant.totalDamageDealtToChampions,
            goldEarned: participant.goldEarned,
            wardsPlaced: participant.wardsPlaced ?? 0,
            minionsKilled: participant.totalMinionsKilled,
            runes: participant.perks?.styles.flatMap((style) =>
                style.selections.map((selection) => selection.perk)
            ) ?? [],
        }));

        participants.sort((a, b) => b.kills - a.kills); // Sorting by kills in descending order

        return { participants };
    } catch (error) {
        throw new Error(`Failed to fetch match data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
