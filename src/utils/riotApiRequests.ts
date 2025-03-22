import {fetchFromRiotAPI} from "@/utils/fetchFromRiotAPI";
import {
    ChampionMastery,
    MatchData,
    MatchResponse,
    Ranked,
    RankedEntry,
    Rune,
    ArenaData
} from "@/types/interfaces";
import {getKDA, getMinionsPerMinute, reversedServerMAP} from "@/utils/helper";
import {getRuneById} from "@/utils/getRuneByID";

export async function fetchAccountData(region: string, gameName: string | string[], tagLine: string | string[]) {
    const response : Response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    return response.json();
}
export async function fetchLeagueData(server: string, summonerId: string): Promise<Ranked> {
    try {
        const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`);
        const rankedData: RankedEntry[] = await response.json();

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
    catch (error) {
        throw new Error(`Failed to fetch league data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export async function fetchSummonerData(server: string, puuid: string) {
    const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    return response.json();
}
export async function fetchMatchData(region: string, puuid: string, queueType?: string, number: number = 5): Promise<string[]> {
    let url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${number}`;

    if (queueType) {
        url += `&queue=${queueType}`;
    }

    const response = await fetchFromRiotAPI(url);
    return response.json();
}
export async function fetchMatchDetailsData(region: string, server: string, matchID: string): Promise<MatchResponse> {
    try {
        const response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`);
        const data: MatchData = await response.json();

        // Process participants and fetch rune details for each participant
        const participantsPromises = data.info.participants.map(async (participant) => {
            // Get rune IDs from participant data
            const runeIds = participant.perks?.styles.flatMap((style) =>
                style.selections.map((selection) => selection.perk)
            ) ?? [];

            // Fetch rune objects for each ID
            const runePromises = runeIds.map(runeId => getRuneById(runeId));
            const runeObjects = await Promise.all(runePromises);

            // Filter out null values in case any rune wasn't found
            const validRunes: Rune[] = runeObjects.filter((rune): rune is Rune => rune !== null);

            // Extract arena data if available
            let arenaData: ArenaData | undefined = undefined;

            if (
                'playerAugment1' in participant ||
                'playerAugment2' in participant ||
                'playerAugment3' in participant ||
                'playerAugment4' in participant ||
                'playerAugment5' in participant ||
                'playerAugment6' in participant
            ) {
                const playerAugments = [
                    participant.playerAugment1,
                    participant.playerAugment2,
                    participant.playerAugment3,
                    participant.playerAugment4,
                    participant.playerAugment5,
                    participant.playerAugment6
                ].filter(augment => augment !== undefined && augment !== 0);

                arenaData = {
                    playerAugments,
                    playerSubteamId: participant.playerSubteamId || 0
                };
            }

            return {
                riotIdGameName: participant.riotIdGameName,
                riotIdTagline: participant.riotIdTagline,
                server: reversedServerMAP[server].toUpperCase(),
                puuid: participant.puuid,
                championId: participant.championId,
                championName: participant.championName,
                teamPosition: participant.teamPosition,
                kills: participant.kills,
                deaths: participant.deaths,
                assists: participant.assists,
                kda: getKDA(participant.kills, participant.deaths, participant.assists),
                visionScore: participant.visionScore,
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
                minionsPerMinute: getMinionsPerMinute(data.info.gameDuration, participant.totalMinionsKilled),
                runes: validRunes,
                win: participant.win,
                teamId: participant.teamId,
                // Add arena data if available
                ...(arenaData && { arenaData })
            };
        });

        const participants = await Promise.all(participantsPromises);

        return {
            gameMode: data.info.gameMode,
            queueId: data.info.queueId,
            gameDuration: data.info.gameDuration,
            gameEndTimestamp: data.info.gameEndTimestamp,
            participants
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch match data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function fetchTopChampionMasteries(server: string, puuid: string, count: number = 10): Promise<ChampionMastery[]> {
    try {
        const response = await fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`);
        // Return the complete ChampionMastery objects
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch top champion mastery data:", error);
        throw new Error(`Failed to fetch top champion mastery data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}