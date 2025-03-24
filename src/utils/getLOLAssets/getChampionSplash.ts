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
        // Get champion name
        const championName: string | null = await getChampionNameById(championId);
        if (!championName) {
            console.error(`No champion name found for ChampionID: ${championId}`);
            return null;
        }
        const formattedChampion: string = championName.replace(/\s+/g, '');

        const url: string = `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/data/en_US/champion/${formattedChampion}.json`;

        // Fetch champion data
        const response : Response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            console.error(`Error fetching data from URL: ${url}`);
            return null;
        }

        // Parse the JSON data
        const data: ChampionApiResponse = await response.json();

        // Validate the data structure
        const championData :ChampionData = data.data[formattedChampion];
        if (!championData || !championData.skins) {
            console.error(`Invalid data structure for champion: ${formattedChampion}`);
            return null;
        }

        const skins = championData.skins;

        // Ensure there are skins available
        if (skins.length === 0) {
            console.error(`No skins found for champion: ${formattedChampion}`);
            return null;
        }

        // Select a random skin
        const randomSkin = skins[Math.floor(Math.random() * skins.length)].num;

        // Return the splash URL
        return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedChampion}_${randomSkin}.jpg`;

    } catch (error) {
        // Handle the error safely
        if (error instanceof Error) {
            console.error(`Failed to get champion splash URL: ${error.message}`);
        } else {
            console.error("An unknown error occurred while fetching the champion splash URL");
        }
        return null;
    }
}
