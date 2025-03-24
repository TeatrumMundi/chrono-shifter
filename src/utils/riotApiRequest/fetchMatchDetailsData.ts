import { ArenaData, Augment, MatchData, MatchResponse, Participant, ProcessedParticipant, Rune } from "@/types/interfaces";
import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";
import { getRuneById } from "@/utils/getRuneByID";
import { fetchAugmentById } from "@/utils/getAugment";
import { getKDA, getMinionsPerMinute, reversedServerMAP } from "@/utils/helper";

/**
 * Fetches match details data for a given match from the Riot Games API.
 *
 * @param {string} region - The region where the match took place (e.g., "EUROPE", "ASIA").
 * @param {string} server - The server identifier for the match data (mapped via `reversedServerMAP`).
 * @param {string} matchID - The unique ID of the match to fetch details for.
 * @returns {Promise<MatchResponse>} A promise that resolves to the match details response containing participants and game information.
 *
 * @throws {Error} Throws an error if the request fails or match data is invalid.
 */
export async function fetchMatchDetailsData(region: string, server: string, matchID: string): Promise<MatchResponse> {
    try {
        // Fetch match data from Riot API
        const response = await fetchFromRiotAPI(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`);
        const data: MatchData = await response.json();

        // Process participants in the match
        const participants = await Promise.all(
            data.info.participants.map(participant => processParticipant(participant, server, data.info.gameDuration))
        );

        // Return structured match details
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

/**
 * Processes individual participant data, extracting relevant statistics and information.
 *
 * @param {Participant} participant - The participant data to process.
 * @param {string} server - The server identifier for the participant (mapped via `reversedServerMAP`).
 * @param {number} gameDuration - The duration of the match in seconds.
 * @returns {Promise<ProcessedParticipant>} A promise that resolves to a processed participant object containing statistics.
 */
async function processParticipant(participant: Participant, server: string, gameDuration: number): Promise<ProcessedParticipant> {
    // Fetch runes and arena data for the participant
    const runes = await fetchParticipantRunes(participant);
    const arenaData = await fetchArenaDataIfExists(participant);

    // Return structured participant data
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
        ...(arenaData && { arenaData })  // Include arena data if it exists
    };
}

/**
 * Extracts items used by the participant in the match.
 *
 * @param {Participant} participant - The participant whose items are to be extracted.
 * @returns {number[]} An array of item IDs used by the participant.
 */
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

/**
 * Fetches rune details for a participant based on the rune IDs.
 *
 * @param {Participant} participant - The participant whose rune details are to be fetched.
 * @returns {Promise<Rune[]>} A promise that resolves to an array of rune details.
 */
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

/**
 * Fetches arena data for a participant if it exists, including augments and subteam ID.
 *
 * @param {Participant} participant - The participant whose arena data is to be fetched.
 * @returns {Promise<ArenaData | undefined>} A promise that resolves to the arena data if available, or `undefined` if not.
 */
async function fetchArenaDataIfExists(participant: Participant): Promise<ArenaData | undefined> {
    // Check if arena data is available by inspecting augment fields
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

    // Fetch augment details for each augment ID
    const augmentPromises = augmentIds.map(augmentId => fetchAugmentById(augmentId));
    const augmentObjects = await Promise.all(augmentPromises);

    // Filter out undefined values in case any augment wasn't found
    const validAugments: Augment[] = augmentObjects.filter((augment): augment is Augment => augment !== undefined);

    return {
        playerAugments: validAugments,
        playerSubteamId: participant.playerSubteamId || 0
    };
}