import {RawChampionMastery, RawRankedEntry} from "@/types/RawInterfaces";

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

export interface ArenaData {
    playerAugments: Augment[];
    playerSubteamId: number;
    placement: number;
}

export interface Rune {
    id: number;
    name: string;
    tooltip: string;
    shortDesc: string;
    longDesc: string;
    iconPath: string;
    runeTree?: string;
}

export interface Champion {
    id: number;
    name: string;
    alias: string;
    squarePortraitPath: string;
    roles: string[];
}

export interface ProcessedParticipant {
    riotIdGameName: string;
    riotIdTagline: string;
    server: string;
    puuid: string;
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
    champion: Champion;
    arenaData?: ArenaData;
    runes: Rune[];
    items: Item[];
}

export interface MatchResponse {
    matchId: string;
    gameMode: string;
    queueId: number;
    gameDuration: number;
    gameEndTimestamp: number;
    participants: ProcessedParticipant[];
}

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
    championMasteries: RawChampionMastery[];
    entries: RawRankedEntry[];
}