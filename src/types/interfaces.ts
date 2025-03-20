export interface Participant {
    riotIdGameName : string;
    puuid: string;
    championId: number;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
    visionScore: number;
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
    win: string;
    nexusLost: number;
    teamId: number;
    perks?: {
        styles: {
            selections: { perk: number }[];
        }[];
    };
}
export interface ProcessedParticipant {
    riotIdGameName : string;
    puuid: string;
    championId: number;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
    kda: string;
    visionScore: number;
    items: number[];
    damageDealt: number;
    goldEarned: number;
    wardsPlaced: number;
    minionsKilled: number;
    minionsPerMinute: string;
    runes: Rune[];
    win: string;
    teamId: number;
}
export interface MatchData {
    info: {
        gameMode: string;
        queueId: number;
        gameDuration: number;
        gameEndTimestamp: number;
        participants: Participant[];
    };
}
export interface MatchResponse {
    gameMode: string;
    queueId: number;
    gameDuration: number;
    gameEndTimestamp: number;
    participants: ProcessedParticipant[];
}
export interface RankedEntry {
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
}
export interface Ranked {
    RankedEntry: RankedEntry[];
}

/**
 * Represents the formatted response data for a summoner profile.
 * This interface combines account information, ranked stats, match history, and champion mastery data.
 */
export interface FormatResponseReturn {
    /** Unique player identifier used across Riot systems */
    puuid: string;
    /** Player's in-game name */
    gameName: string;
    /** Player's tag line (e.g., #EUW) */
    tagLine: string;
    /** ID of the profile icon used by the summoner */
    profileIconId: string;
    /** Current level of the summoner account */
    summonerLevel: string;
    /** Solo/Duo queue tier (e.g., GOLD, PLATINUM) */
    soloTier: string;
    /** Solo/Duo queue rank within tier (e.g., I, II, III, IV) */
    soloRank: string;
    /** Number of wins in Solo/Duo queue */
    soloWins: number;
    /** Number of losses in Solo/Duo queue */
    soloLosses: number;
    /** Current League Points in Solo/Duo queue */
    soloLP: number;
    /** Win ratio percentage in Solo/Duo queue */
    soloWR: number;
    /** Flex queue tier (e.g., GOLD, PLATINUM) */
    flexTier: string;
    /** Flex queue rank within tier (e.g., I, II, III, IV) */
    flexRank: string;
    /** Number of wins in Flex queue */
    flexWins: number;
    /** Number of losses in Flex queue */
    flexLosses: number;
    /** Current League Points in Flex queue */
    flexLP: number;
    /** Win ratio percentage in Flex queue */
    flexWR: number;
    /** Array of recent match data */
    match: MatchResponse[];
    /** Array of champion mastery data representing the summoner's top mastery champions */
    championMasteries: ChampionMastery[];
}

export interface BannerProps {
    data: FormatResponseReturn;
}
export interface ChampionMastery {
    championId: number;
    championLevel: number;
    championPoints: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    chestGranted: boolean;
    tokensEarned: number;
    summonerId: string;
    puuid: string;
}
export interface RuneSlot {
    runes: Rune[];
}
export interface Rune {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
}
export interface RunePath {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: RuneSlot[];
}