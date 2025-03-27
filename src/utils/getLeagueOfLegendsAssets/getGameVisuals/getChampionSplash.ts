'use server';

import { getChampionById } from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getChampionObject";
import { Champion } from "@/types/interfaces";

const GAME_VERSION: string = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// In-memory splash cache: championId -> splash URL
const splashCache = new Map<number, string>();

interface Skin {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
}

interface ChampionData {
    id: string;
    name: string;
    skins: Skin[];
}

interface ChampionApiResponse {
    data: {
        [key: string]: ChampionData;
    };
}

/**
 * Fetches a splash art URL for a champion using the Riot Data Dragon API.
 * Caches the result in-memory for faster repeat calls.
 */
export async function getChampionSplashUrl(championId: number): Promise<string | null> {
    // ✅ Return from cache if already fetched
    if (splashCache.has(championId)) {
        return splashCache.get(championId)!;
    }

    try {
        const champion: Champion | undefined = await getChampionById(championId);
        if (!champion) {
            console.error(`Champion with ID ${championId} not found in champions.json`);
            return null;
        }

        // Format name for Riot API (with exception for LeeSin)
        let formattedName = champion.name.replace(/[\s']/g, "");
        // Known exceptions that need exact casing
        // Known exceptions that need exact casing
        const riotCaseExceptions: Record<string, string> = {
            leesin: "LeeSin",
            masteryi: "MasterYi",
            aurelionsol: "AurelionSol",
            jarvaniv: "JarvanIV",
            khazix: "KhaZix",
            chogath: "ChoGath",
            rektsai: "RekSai",
            velkoz: "VelKoz",
            monkeyking: "Wukong",
        };

        const lowercaseKey = formattedName.toLowerCase();
        formattedName = riotCaseExceptions[lowercaseKey] || formattedName;

        const championDataUrl = `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/data/en_US/champion/${formattedName}.json`;

        const response = await fetch(championDataUrl);
        if (!response.ok) {
            console.error(`Failed to fetch champion data: ${championDataUrl}`);
            return null;
        }

        const data: ChampionApiResponse = await response.json();
        const championData = data.data[formattedName];

        if (!championData || !championData.skins?.length) {
            console.error(`No skin data found for champion: ${formattedName}`);
            return null;
        }

        const randomSkin = championData.skins[Math.floor(Math.random() * championData.skins.length)].num;
        const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedName}_${randomSkin}.jpg`;

        // ✅ Cache result
        splashCache.set(championId, splashUrl);

        return splashUrl;
    } catch (error) {
        console.error("Error fetching splash art:", error);
        return null;
    }
}
