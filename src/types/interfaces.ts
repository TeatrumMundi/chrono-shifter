/**
 * Core player identity types
 */
export interface PlayerIdentity {
    riotIdGameName: string;
    riotIdTagline: string;
    server: string;
    puuid: string;
}

/**
 * Base game performance statistics shared across modes
 */
export interface GamePerformance {
    championId: number;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
    visionScore: number;
    totalDamageDealtToChampions: number;
    goldEarned: number;
    wardsPlaced?: number;
    totalMinionsKilled: number;
    win: string;
    teamId: number;
}

/**
 * Item information for a participant
 */
export interface ItemSet {
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
}

/**
 * Item object information
 */
export interface Item {
    id: number;
    name: string;
    description: string;
    active: boolean;
    inStore: boolean;
    from: number[];
    to: number[];
    categories: string[];
    maxStacks: number;
    requiredChampion: string;
    requiredAlly: string;
    requiredBuffCurrencyName: string;
    requiredBuffCurrencyCost: number;
    specialRecipe: number;
    isEnchantment: boolean;
    price: number;
    priceTotal: number;
    displayInItemSets: boolean;
    iconPath: string;
}

/**
 * Arena-specific data
 */
export interface ArenaData {
    playerAugments: Augment[];
    playerSubteamId: number;
}

/**
 * Raw participant data as received from the API
 */
export interface Participant extends PlayerIdentity, GamePerformance, ItemSet {
    nexusLost: number;
    perks?: {
        styles: {
            selections: { perk: number }[];
        }[];
    };
    playerAugment1?: number;
    playerAugment2?: number;
    playerAugment3?: number;
    playerAugment4?: number;
    playerAugment5?: number;
    playerAugment6?: number;
    playerSubteamId?: number;
}

/**
 * Processed participant data with calculated statistics
 */
export interface ProcessedParticipant extends PlayerIdentity {
    championId: number;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
    kda: string;
    visionScore: number;
    items: Item[];
    damageDealt: number;
    goldEarned: number;
    wardsPlaced: number;
    minionsKilled: number;
    minionsPerMinute: string;
    runes: Rune[];
    win: string;
    teamId: number;
    arenaData?: ArenaData;
}

/**
 * Raw match data as received from the API
 */
export interface MatchData {
    info: {
        gameMode: string;
        queueId: number;
        gameDuration: number;
        gameEndTimestamp: number;
        participants: Participant[];
    };
}

/**
 * Processed match data for front-end use
 */
export interface MatchResponse {
    gameMode: string;
    queueId: number;
    gameDuration: number;
    gameEndTimestamp: number;
    participants: ProcessedParticipant[];
}

/**
 * Represents a single ranked queue entry
 */
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

/**
 * Collection of ranked entries
 */
export interface Ranked {
    entries: RankedEntry[];
}

/**
 * Represents rune information
 */
export interface Rune {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
    runePath: {
        id: number;
        key: string;
        icon: string;
        name: string;
    };
}

/**
 * Represents a slot for runes in a rune path
 */
export interface RuneSlot {
    runes: Rune[];
}

/**
 * Represents a complete rune path with slots
 */
export interface RunePath {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: RuneSlot[];
}

/**
 * Champion mastery information
 */
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

/**
 * Props for the Banner component
 */
export interface BannerProps {
    data: FormatResponseReturn;
}

export type Augment = {
    apiName: string;
    calculations: object;
    dataValues: object;
    desc: string;
    iconLarge: string;
    iconSmall: string;
    id: number;
    name: string;
    rarity: number;
    tooltip: string;
};

export type AugmentData = {
    augments: Augment[];
};