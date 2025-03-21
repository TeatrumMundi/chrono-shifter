import { getChampionNameById } from "@/utils/getChampionNameById";

// Declare game version once at the module level
const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Summoner Icon
export function getSummonerIconUrl(profileIconId: string): string {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/profileicon/${profileIconId}.png`;
}

// Champion Splash Art
export async function getChampionSplashUrl(championId: number): Promise<string> {
    const championName = await getChampionNameById(championId);
    if (!championName) {
        throw new Error("Champion name not found");
    }

    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/data/en_US/champion/${championName}.json`);
    const data = await response.json();
    const skins = data.data[championName].skins;
    const randomSkin = skins[Math.floor(Math.random() * skins.length)].num;

    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${randomSkin}.jpg`;
}

// Champion Icon
export const getChampionIcon = (championName: string): string => {
    const formattedName = championName.replace(/[^a-zA-Z]/g, ""); // Remove special characters
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/champion/${formattedName}.png`;
};

// Item Icon
export function getItemIcon(itemId: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/item/${itemId}.png`;
}

// Rune Icon
export async function getRuneImageUrl(runePath: string): Promise<string> {
    // Base URL for Data Dragon where rune data is stored
    const ddragonBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";

    // Full URL to access the image
    const imageUrl = `${ddragonBaseUrl}${runePath}`;

    try {
        // Checking if the image exists
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
            return imageUrl;
        }
    } catch (error) {
        console.error(error);
        return `Rune image not found: ${imageUrl}`;
    }

    return `Rune image not found: ${imageUrl}`;
}