import { ArenaData, Augment, MatchData, MatchResponse, Participant, ProcessedParticipant, Rune, Item } from "@/types/interfaces";
import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";
import { getRuneById } from "@/utils/getRuneByID";
import { fetchAugmentById } from "@/utils/getAugment";
import { getKDA, getMinionsPerMinute, reversedServerMAP } from "@/utils/helper";
import {getItemObject} from "@/utils/getLeagueOfLegendsAssets/getItemObject";

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

    return {
        riotIdGameName: participant.riotIdGameName,
        riotIdTagline: participant.riotIdTagline,
        server: reversedServerMAP[server].toUpperCase(),
        puuid: participant.puuid,
        championId: participant.championId,
        championName: participant.championName,
        teamPosition: participant.teamPosition,
        champLevel : participant.champLevel,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        kda: getKDA(participant.kills, participant.deaths, participant.assists),
        visionScore: participant.visionScore,
        visionPerMinute: getMinionsPerMinute(gameDuration, participant.visionScore),
        items: extractItems(participant),  // Now returns full Item objects
        damageDealt: participant.totalDamageDealtToChampions,
        goldEarned: participant.goldEarned,
        wardsPlaced: participant.wardsPlaced ?? 0,
        totalHealsOnTeammates : participant.totalHealsOnTeammates,
        totalDamageShieldedOnTeammates : participant.totalDamageShieldedOnTeammates,
        minionsKilled: participant.totalMinionsKilled,
        minionsPerMinute: getMinionsPerMinute(gameDuration, participant.totalMinionsKilled),
        runes,
        win: participant.win,
        teamId: participant.teamId,
        ...(arenaData && { arenaData })
    };
}

/**
 * Extracts items used by the participant in the match.
 *
 * @param {Participant} participant - The participant whose items are to be extracted.
 * @returns {Item[]} An array of item objects used by the participant.
 */
function extractItems(participant: Participant): Item[] {
    const itemIds : number[] = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
    ];

    // Filter out any empty slots (assuming 0 means no item), and map each ID to its full item object.
    return itemIds
        .filter(id => id && id > 0)
        .map(id => {
            const item = getItemObject(id);
            if (!item) {
                throw new Error(`Item with ID ${id} not found in items.json`);
            }
            return item;
        });
}

/**
 * Fetches rune details for a participant based on the rune IDs.
 *
 * @param {Participant} participant - The participant whose rune details are to be fetched.
 * @returns {Promise<Rune[]>} A promise that resolves to an array of rune details.
 */
async function fetchParticipantRunes(participant: Participant): Promise<Rune[]> {
    const runeIds = participant.perks?.styles.flatMap(style =>
        style.selections.map(selection => selection.perk)
    ) ?? [];

    const runePromises = runeIds.map(runeId => getRuneById(runeId));
    const runeObjects = await Promise.all(runePromises);
    return runeObjects.filter((rune): rune is Rune => rune !== null);
}

/**
 * Fetches arena data for a participant if it exists, including augments and subteam ID.
 *
 * @param {Participant} participant - The participant whose arena data is to be fetched.
 * @returns {Promise<ArenaData | undefined>} A promise that resolves to the arena data if available, or `undefined` if not.
 */
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

    const augmentIds = [
        participant.playerAugment1,
        participant.playerAugment2,
        participant.playerAugment3,
        participant.playerAugment4,
        participant.playerAugment5,
        participant.playerAugment6
    ].filter(augmentId => augmentId !== undefined && augmentId !== 0) as number[];

    const augmentPromises = augmentIds.map(augmentId => fetchAugmentById(augmentId));
    const augmentObjects = await Promise.all(augmentPromises);
    const validAugments: Augment[] = augmentObjects.filter((augment): augment is Augment => augment !== undefined);

    return {
        playerAugments: validAugments,
        playerSubteamId: participant.playerSubteamId || 0,
        placement: participant.placement || 0
    };
}
