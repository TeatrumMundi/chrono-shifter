import {getChampionNameById} from "@/utils/getChampionNameById";

export function getSummonerIconUrl(profileIconId: string): string {
    // Get version from environment variable, with fallback to a default version
    const version = process.env.GAME_VERSION || '13.24.1';
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
}

export async function getChampionSplashUrl(championId: number): Promise<string> {
    const championName: string | null = await getChampionNameById(championId);
    if (!championName) {
        throw new Error("Champion name not found");
    }

    // Fetch champion details to get the number of skins
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion/${championName}.json`);
    const data = await response.json();

    const skins = data.data[championName].skins;
    const randomSkin = skins[Math.floor(Math.random() * skins.length)].num;

    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${randomSkin}.jpg`;
}
