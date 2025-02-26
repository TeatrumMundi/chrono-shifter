export interface Participant {
    riotIdGameName : string;
    puuid: string;
    championId: number;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
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
export interface MatchData {
    info: {
        gameMode: string;
        gameDuration: number;
        gameEndTimestamp: number;
        participants: Participant[];
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
    items: number[];
    damageDealt: number;
    goldEarned: number;
    wardsPlaced: number;
    minionsKilled: number;
    runes: number[];
    win: string;
    teamId: number;
}
export interface MatchResponse {
    gameMode: string;
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
export interface SummonerData {
    gameName: string;
    tagLine: string;
    profileIconId: string;
    summonerLevel: string;
    soloTier?: string;
    soloRank?: string;
    soloWins: number;
    soloLosses: number;
    soloLP: number;
    soloWR: number;
    flexTier?: string;
    flexRank?: string;
    flexWins: number;
    flexLosses: number;
    flexLP: number;
    flexWR: number;
    match: MatchResponse[];
}
