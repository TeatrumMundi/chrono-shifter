const regionMAP: Record<string, string> = {
    NA: "AMERICAS", BR: "AMERICAS", LAN: "AMERICAS", LAS: "AMERICAS",
    EUW: "EUROPE", EUNE: "EUROPE", RU: "EUROPE", TR: "EUROPE",
    KR: "ASIA", JP: "ASIA", VN: "ASIA", ME: "ASIA",
    OCE: "SEA", SEA: "SEA", TW: "SEA",
};
const serverMAP: Record<string, string> = {
    EUNE: "EUN1", EUW: "EUN2",
    JP: "JP1", KR: "KR",
    LAN: "LA1", LAS: "LA2", ME: "ME1",
    NA: "NA1", OCE: "OC1", RU: "RU",
    SEA: "SG2", TR: "TR1", TW: "TW2", VN: "VN2",
};

export function calculateWinRatio(wins: number, losses: number): number {
    if (losses === 0 && wins > 0) return 100;
    if (wins === 0) return 0;
    return parseFloat(((wins / (wins + losses)) * 100).toFixed(0));
} // Calculate winRatio based on wins and loses

export function getRegion(server: string): string {return regionMAP[server] || "UNKNOWN";} //Returns region suitable for API
export function getServer(server: string): string {return serverMAP[server] || "UNKNOWN";} //Returns server suitable for API