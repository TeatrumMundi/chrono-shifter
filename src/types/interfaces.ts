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
    champLevel: number;
    kills: number;
    deaths: number;
    assists: number;
    visionScore: number;
    totalDamageDealtToChampions: number;
    goldEarned: number;
    wardsPlaced?: number;
    totalHealsOnTeammates: number;
    totalDamageShieldedOnTeammates: number;
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
 * Detailed item object information
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
 * Represents an augment option
 */
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

/**
 * Arena-specific data
 */
export interface ArenaData {
    playerAugments: Augment[];
    playerSubteamId: number;
    placement: number;
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
    placement?: number;
}

/**
 * Represents rune information
 */
export interface Rune {
    id: number;
    name: string;
    tooltip: string;
    shortDesc: string;
    longDesc: string;
    iconPath: string;
    runeTree?: string;
}

/**
 * Champion information
 */
export interface Champion {
    id: number;
    name: string;
    alias: string;
    squarePortraitPath: string;
    roles: string[];
}

/**
 * Processed participant data with calculated statistics
 */
export interface ProcessedParticipant extends PlayerIdentity {
    champion: Champion;
    teamPosition: string;
    champLevel: number;
    kills: number;
    deaths: number;
    assists: number;
    kda: string;
    visionScore: number;
    visionPerMinute: string;
    damageDealt: number;
    goldEarned: number;
    wardsPlaced: number;
    totalHealsOnTeammates: number;
    totalDamageShieldedOnTeammates: number;
    minionsKilled: number;
    minionsPerMinute: string;
    win: string;
    teamId: number;
    arenaData?: ArenaData;
    runes: Rune[];
    items: Item[];
}

/**
 * Raw match data as received from the API
 */
export interface MatchData {
    info: {
        matchId: string;
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
    matchId: string;
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
    puuid: string;
    gameName: string;
    server: string;
    tagLine: string;
    profileIconId: string;
    summonerLevel: string;
    soloTier: string;
    soloRank: string;
    soloWins: number;
    soloLosses: number;
    soloLP: number;
    soloWR: number;
    flexTier: string;
    flexRank: string;
    flexWins: number;
    flexLosses: number;
    flexLP: number;
    flexWR: number;
    match: MatchResponse[];
    championMasteries: ChampionMastery[];
    entries: RankedEntry[];
}

