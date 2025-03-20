import { MatchResponse, ProcessedParticipant } from "@/types/interfaces";

export const queueIdToGameMode: { [key: number]: string } = {
    0: "Custom games",
    2: "Normal 5v5 Blind Pick",
    4: "Ranked Solo 5v5",
    6: "Ranked Premade 5v5",
    7: "Co-op vs AI 5v5",
    8: "Normal 3v3",
    9: "Ranked 3v3",
    14: "Normal 5v5 Draft Pick",
    16: "Dominion 5v5 Blind Pick",
    17: "Dominion 5v5 Draft Pick",
    25: "Dominion Co-op vs AI",
    31: "Co-op vs AI Intro Bot",
    32: "Co-op vs AI Beginner Bot",
    33: "Co-op vs AI Intermediate Bot",
    41: "Ranked Team 3v3",
    42: "Ranked Team 5v5",
    52: "Twisted Treeline Co-op vs AI",
    61: "Team Builder",
    65: "ARAM",
    70: "One for All",
    72: "Snowdown Showdown 1v1",
    73: "Snowdown Showdown 2v2",
    75: "Hexakill Summoner's Rift",
    76: "URF",
    78: "One For All: Mirror Mode",
    83: "Co-op vs AI URF",
    91: "Doom Bots Rank 1",
    92: "Doom Bots Rank 2",
    93: "Doom Bots Rank 5",
    96: "Ascension",
    98: "Hexakill Twisted Treeline",
    100: "ARAM Butcher's Bridge",
    300: "Legend of the Poro King",
    310: "Nemesis",
    313: "Black Market Brawlers",
    317: "Definitely Not Dominion",
    325: "All Random",
    400: "Normal 5v5 Draft Pick",
    410: "Ranked Dynamic Queue",
    420: "Ranked Solo/Duo",
    430: "Normal 5v5 Blind Pick",
    440: "Ranked Flex 5v5",
    450: "ARAM",
    460: "Normal 3v3 Blind Pick",
    470: "Ranked Flex 3v3",
    600: "Blood Hunt Assassin",
    610: "Dark Star: Singularity",
    700: "Clash",
    800: "Co-op vs. AI Intermediate Bot",
    810: "Co-op vs. AI Intro Bot",
    820: "Co-op vs. AI Beginner Bot",
    830: "Co-op vs. AI Intro Bot",
    840: "Co-op vs. AI Beginner Bot",
    850: "Co-op vs. AI Intermediate Bot",
    900: "ARURF",
    910: "Ascension",
    920: "Legend of the Poro King",
    940: "Nexus Siege",
    950: "Doom Bots Voting",
    960: "Doom Bots Standard",
    980: "Star Guardian Invasion: Normal",
    990: "Star Guardian Invasion: Onslaught",
    1000: "PROJECT: Hunters",
    1010: "Snow ARURF",
    1020: "One for All",
    1030: "Odyssey Extraction: Intro",
    1040: "Odyssey Extraction: Cadet",
    1050: "Odyssey Extraction: Crewmember",
    1060: "Odyssey Extraction: Captain",
    1070: "Odyssey Extraction: Onslaught",
    1090: "Teamfight Tactics",
    1100: "Ranked Teamfight Tactics",
    1110: "Teamfight Tactics Tutorial",
    1111: "Teamfight Tactics test",
    1200: "Nexus Blitz",
    1300: "Nexus Blitz",
    1400: "Ultimate Spellbook",
    1700: "Arena",
    1701: "1v0 (Arena)",
    1704: "4v0 (Arena)"
};

const regionMAP: Record<string, string> = {
    na: "AMERICAS", br: "AMERICAS", lan: "AMERICAS", las: "AMERICAS",
    euw: "EUROPE", eune: "EUROPE", ru: "EUROPE", tr: "EUROPE",
    kr: "ASIA", jp: "ASIA", vn: "ASIA", me: "ASIA",
    oce: "SEA", sea: "SEA", tw: "SEA",
};
const serverMAP: Record<string, string> = {
    eune: "EUN1", euw: "EUW1",
    jp: "JP1", kr: "KR",
    lan: "LA1", las: "LA2", me: "ME1",
    na: "NA1", oce: "OC1", ru: "RU",
    sea: "SG2", tr: "TR1", tw: "TW2", vn: "VN2",
};
export function calculateWinRatio(wins: number, losses: number): number {
    if (losses === 0 && wins > 0) return 100;
    if (wins === 0) return 0;
    return parseFloat(((wins / (wins + losses)) * 100).toFixed(0));
} // Calculate winRatio based on wins and losses
export function getRegion(server: string): string {
    server = server.toLowerCase();
    return regionMAP[server] || "UNKNOWN";
} //Returns region suitable for API
export function getServer(server: string): string {
    server = server.toLowerCase();
    return serverMAP[server] || "UNKNOWN";
} //Returns server suitable for API
export function secToHHMMSS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num < 10 ? `0${num}` : num.toString();

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    if (minutes > 0) {
        return `${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `${pad(remainingSeconds)}`;
} // Returns the formatted string in hh:mm:ss format.

export function timeAgo(timestamp: number): string {
    const now = Date.now();
    const difference = now - timestamp;

    const intervals = {
        year: 31536000000,
        month: 2592000000,
        day: 86400000,
        hour: 3600000,
        minute: 60000,
        second: 1000,
    };

    if (difference < intervals.minute) {
        const seconds = Math.floor(difference / intervals.second);
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (difference < intervals.hour) {
        const minutes = Math.floor(difference / intervals.minute);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (difference < intervals.day) {
        const hours = Math.floor(difference / intervals.hour);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (difference < intervals.month) {
        const days = Math.floor(difference / intervals.day);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (difference < intervals.year) {
        const months = Math.floor(difference / intervals.month);
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(difference / intervals.year);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}
export function getParticipantByPuuid(matchData: MatchResponse, puuid: string): ProcessedParticipant | null {
    return matchData.participants.find(participant => participant.puuid === puuid) ?? null;
}
export function getKDA(kills: number, deaths: number, assists: number): string {
    if (deaths === 0) {
        return "Perfect";
    }
    const kda = ((kills + assists) / deaths).toFixed(2);
    return kda.toString();
}
export function getMinionsPerMinute(seconds: number, totalMinions: number): string {
    const minutes = Math.floor((seconds % 3600) / 60);
    if (minutes === 0) return "0"; // Avoid division by zero
    return (totalMinions / minutes).toFixed(2);
}