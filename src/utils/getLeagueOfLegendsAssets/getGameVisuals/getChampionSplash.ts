import { getChampionNameById } from "@/utils/getChampionNameById";

const GAME_VERSION: string = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

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

export async function getChampionSplashUrl(championId: number): Promise<string | null> {
    try {
        // Retrieve champion name by ID.
        const championName = await getChampionNameById(championId);
        if (!championName) {
            console.error(`No champion name found for ChampionID: ${championId}`);
            return null;
        }

        // Remove spaces and apostrophes, then format to match expected API key and URL.
        const sanitizedChampionName = championName.replace(/[\s']/g, '');
        // Assumes that the API expects the first letter uppercase and the rest lowercase.
        const championNameForUrl = sanitizedChampionName.charAt(0).toUpperCase() + sanitizedChampionName.slice(1).toLowerCase();

        // Construct the URL for champion data.
        const championDataUrl = `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/data/en_US/champion/${championNameForUrl}.json`;

        // Fetch champion data.
        const response = await fetch(championDataUrl);
        if (!response.ok) {
            console.error(`Error fetching champion data from URL: ${championDataUrl}`);
            return null;
        }

        // Parse JSON response.
        const data: ChampionApiResponse = await response.json();

        // Use the properly formatted champion name for data lookup.
        const championData: ChampionData = data.data[championNameForUrl];
        if (!championData || !championData.skins?.length) {
            console.error(`Invalid data structure or no skins available for champion: ${championNameForUrl}`);
            return null;
        }

        // Select a random skin.
        const skins = championData.skins;
        const randomSkin = skins[Math.floor(Math.random() * skins.length)].num;

        // Construct and return the splash URL.
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championNameForUrl}_${randomSkin}.jpg`;
    } catch (error) {
        // Log detailed error information.
        if (error instanceof Error) {
            console.error(`Failed to get champion splash URL: ${error.message}`);
        } else {
            console.error("An unknown error occurred while fetching the champion splash URL");
        }
        return null;
    }
}

