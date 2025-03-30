import { ArenaData, Augment, MatchResponse, ProcessedParticipant, Rune, Item } from "@/types/ProcessedInterfaces";
import { fetchFromRiotAPI } from "@/utils/riotApiRequest/fetchFromRiotAPI";
import { getKDA, getMinionsPerMinute, reversedServerMAP } from "@/utils/helper";
import {getRuneById} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getRuneObject";
import {getAugmentById} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAugmentObject";
import {getItemById} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getItemObject";

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
        const data: RawMatchData = await response.json();

        // Process participants in the match
        const participants = await Promise.all(
            data.info.participants.map(participant => processParticipant(participant, server, data.info.gameDuration))
        );

        // Return structured match details
        return {
            matchId: data.metadata.matchId,
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
 * @param {RawParticipant} participant - The participant data to process.
 * @param {string} server - The server identifier for the participant (mapped via `reversedServerMAP`).
 * @param {number} gameDuration - The duration of the match in seconds.
 * @returns {Promise<ProcessedParticipant>} A promise that resolves to a processed participant object containing statistics.
 */
import { getChampionById } from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getChampionObject";
import {RawMatchData, RawParticipant} from "@/types/RawInterfaces";

async function processParticipant(participant: RawParticipant, server: string, gameDuration: number): Promise<ProcessedParticipant> {
    const runes: Rune[] = await fetchParticipantRunes(participant);
    const arenaData = await fetchArenaDataIfExists(participant);
    const champion = await getChampionById(participant.championId);

    if (!champion) {
        throw new Error(`Champion with ID ${participant.championId} not found in champions.json`);
    }

    return {
        riotIdGameName: participant.riotIdGameName,
        riotIdTagline: participant.riotIdTagline,
        server: reversedServerMAP[server].toUpperCase(),
        puuid: participant.puuid,
        champion,
        teamPosition: participant.teamPosition,
        champLevel: participant.champLevel,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        kda: getKDA(participant.kills, participant.deaths, participant.assists),
        visionScore: participant.visionScore,
        visionPerMinute: getMinionsPerMinute(gameDuration, participant.visionScore),
        items: await extractItems(participant),
        damageDealt: participant.totalDamageDealtToChampions,
        goldEarned: participant.goldEarned,
        wardsPlaced: participant.wardsPlaced ?? 0,
        totalHealsOnTeammates: participant.totalHealsOnTeammates,
        totalDamageShieldedOnTeammates: participant.totalDamageShieldedOnTeammates,
        minionsKilled: participant.totalMinionsKilled,
        minionsPerMinute: getMinionsPerMinute(gameDuration, participant.totalMinionsKilled),
        runes,
        win: participant.win,
        teamId: participant.teamId,
        ...(arenaData && { arenaData }),
    };
}

/**
 * Extracts all item objects for a participant by fetching from local items.json.
 */
export async function extractItems(participant: RawParticipant): Promise<Item[]> {
    const itemIds: number[] = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
    ];

    const itemPromises = itemIds
        .filter(id => id && id > 0)
        .map(async (id) => {
            const item = await getItemById(id);
            if (!item) {
                throw new Error(`Item with ID ${id} not found in items.json`);
            }
            return item;
        });

    return await Promise.all(itemPromises);
}

/**
 * Fetches rune details for a participant based on the rune IDs.
 *
 * @param {RawParticipant} participant - The participant whose rune details are to be fetched.
 * @returns {Promise<Rune[]>} A promise that resolves to an array of rune details.
 */
async function fetchParticipantRunes(participant: RawParticipant): Promise<Rune[]> {
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
 * @param {RawParticipant} participant - The participant whose arena data is to be fetched.
 * @returns {Promise<ArenaData | undefined>} A promise that resolves to the arena data if available, or `undefined` if not.
 */
async function fetchArenaDataIfExists(participant: RawParticipant): Promise<ArenaData | undefined> {
    const hasArenaData = [
        'playerAugment1',
        'playerAugment2',
        'playerAugment3',
        'playerAugment4',
        'playerAugment5',
        'playerAugment6'
    ].some(key => participant[key as keyof RawParticipant] !== undefined && participant[key as keyof RawParticipant] !== 0);

    if (!hasArenaData) return undefined;

    const augmentIds = [
        participant.playerAugment1,
        participant.playerAugment2,
        participant.playerAugment3,
        participant.playerAugment4,
        participant.playerAugment5,
        participant.playerAugment6
    ].filter(augmentId => augmentId !== undefined && augmentId !== 0) as number[];

    const augmentPromises = augmentIds.map(augmentId => getAugmentById(augmentId));
    const augmentObjects = await Promise.all(augmentPromises);
    const validAugments: Augment[] = augmentObjects.filter((augment): augment is Augment => augment !== undefined);

    return {
        playerAugments: validAugments,
        playerSubteamId: participant.playerSubteamId || 0,
        placement: participant.placement || 0
    };
}
