import { MatchResponse, ProcessedParticipant } from "@/app/apiiHandler/Interfaces/interfaces";

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
export function checkResponse(response: Response): void {
    if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
    }
}
export async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);
        checkResponse(response); // Validate the response
        return await response.json();
    } catch (error) {
        throw error; // Rethrow the original error
    }
}
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
export function getWinOrLose(isNexusKilled: number): string {
    return isNexusKilled === 0 ? "Win" : "Lose";
} // Returns Win or lose based on nexus status
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