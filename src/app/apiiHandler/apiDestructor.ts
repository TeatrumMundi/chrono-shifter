import {fetchData, getWinOrLose} from "@/app/apiiHandler/helper";
import {
    MatchData,
    MatchResponse,
    ProcessedParticipant,
    Ranked,
    RankedEntry
} from "@/app/apiiHandler/Interfaces/interfaces";
const DEFAULT_URL = "http://localhost:3000/api";


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
            riotIdGameName: participant.riotIdGameName,
            puuid: participant.puuid,
            championId: participant.championId,
            championName: participant.championName,
            teamPosition: participant.teamPosition,
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
            win: getWinOrLose(participant.nexusLost),
            teamId: participant.teamId,
        }));

        return {
            gameMode: data.info.gameMode,
            gameDuration: data.info.gameDuration,
            gameEndTimestamp: data.info.gameEndTimestamp,
            participants
        };
    }
    catch (error)
    {
        throw new Error(`Failed to fetch match data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export async function fetchLeagueData(server: string, summonerId: string): Promise<Ranked> {
    const url = `${DEFAULT_URL}/league/by-summoner?server=${server}&summonerID=${summonerId}`;

    try
    {
        const rankedData: RankedEntry[] = await fetchData<RankedEntry[]>(url);
        const soloQueue = rankedData.find(entry => entry.queueType === "RANKED_SOLO_5x5");
        const flexQueue = rankedData.find(entry => entry.queueType === "RANKED_FLEX_SR");

        const allQueues: Ranked = {
            RankedEntry: []
        };

        if (soloQueue) {
            allQueues.RankedEntry.push(soloQueue);
        }

        if (flexQueue) {
            allQueues.RankedEntry.push(flexQueue);
        }

        return allQueues;
    }
    catch (error)
    {
        throw new Error(`Failed to fetch league data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
