export interface RawPlayerIdentity {
    riotIdGameName: string;
    riotIdTagline: string;
    server: string;
    puuid: string;
}

export interface RawGamePerformance {
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
    win: boolean;
    teamId: number;
}

export interface RawItemSet {
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
}

export interface RawParticipant extends RawPlayerIdentity, RawGamePerformance, RawItemSet {
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

export interface RawMatchData {
    metadata: {
        matchId: string;
        dataVersion: string;
        participants: string[];
    };
    info: {
        gameMode: string;
        queueId: number;
        gameDuration: number;
        gameEndTimestamp: number;
        participants: RawParticipant[];
    };
}

export interface RawRankedEntry {
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

export interface RawRanked {
    entries: RawRankedEntry[];
}

export interface RawChampionMastery {
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


