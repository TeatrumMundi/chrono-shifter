import { ArenaData, Augment, MatchData, MatchResponse, Participant, ProcessedParticipant, Rune } from "@/types/interfaces";
import { fetchFromRiotAPI } from "@/utils/fetchFromRiotAPI";
import { getRuneById } from "@/utils/getRuneByID";
import { fetchAugmentById } from "@/utils/getAugment";
import { getKDA, getMinionsPerMinute, reversedServerMAP } from "@/utils/helper";

// Main function to fetch match details
export async function fetchMatchDetailsData(region: string, server: string, matchID: string): Promise<MatchResponse> {
    try {
        const response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`);
        const data: MatchData = await response.json();

        const participants = await Promise.all(
            data.info.participants.map(participant => processParticipant(participant, server, data.info.gameDuration))
        );

        return {
            gameMode: data.info.gameMode,
            queueId: data.info.queueId,
            gameDuration: data.info.gameDuration,
            gameEndTimestamp: data.info.gameEndTimestamp,
            participants
        };
    } catch (error) {
        throw new Error(`Failed to fetch match data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

// Process individual participant data
async function processParticipant(participant: Participant, server: string, gameDuration: number): Promise<ProcessedParticipant> {
    const runes = await fetchParticipantRunes(participant);
    const arenaData = await fetchArenaDataIfExists(participant);

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
        items: extractItems(participant),
        damageDealt: participant.totalDamageDealtToChampions,
        goldEarned: participant.goldEarned,
        wardsPlaced: participant.wardsPlaced ?? 0,
        minionsKilled: participant.totalMinionsKilled,
        minionsPerMinute: getMinionsPerMinute(gameDuration, participant.totalMinionsKilled),
        runes,
        win: participant.win,
        teamId: participant.teamId,
        ...(arenaData && { arenaData })
    };
}

// Extract participant's items
function extractItems(participant: Participant): number[] {
    return [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
    ];
}

// Fetch rune details for a participant
async function fetchParticipantRunes(participant: Participant): Promise<Rune[]> {
    // Get rune IDs from participant data
    const runeIds = participant.perks?.styles.flatMap((style) =>
        style.selections.map((selection) => selection.perk)
    ) ?? [];

    // Fetch rune objects for each ID
    const runePromises = runeIds.map(runeId => getRuneById(runeId));
    const runeObjects = await Promise.all(runePromises);

    // Filter out null values in case any rune wasn't found
    return runeObjects.filter((rune): rune is Rune => rune !== null);
}

// Fetch arena data if it exists
async function fetchArenaDataIfExists(participant: Participant): Promise<ArenaData | undefined> {
    const hasArenaData = [
        'playerAugment1',
        'playerAugment2',
        'playerAugment3',
        'playerAugment4',
        'playerAugment5',
        'playerAugment6'
    ].some(key => participant[key as keyof Participant] !== undefined && participant[key as keyof Participant] !== 0);

    if (!hasArenaData) return undefined;

    // Get augment IDs from participant data
    const augmentIds = [
        participant.playerAugment1,
        participant.playerAugment2,
        participant.playerAugment3,
        participant.playerAugment4,
        participant.playerAugment5,
        participant.playerAugment6
    ].filter(augmentId => augmentId !== undefined && augmentId !== 0) as number[];

    // Fetch augment details for each ID
    const augmentPromises = augmentIds.map(augmentId => fetchAugmentById(augmentId));
    const augmentObjects = await Promise.all(augmentPromises);

    // Filter out undefined values in case any augment wasn't found
    const validAugments: Augment[] = augmentObjects.filter((augment): augment is Augment => augment !== undefined);

    return {
        playerAugments: validAugments,
        playerSubteamId: participant.playerSubteamId || 0
    };
}