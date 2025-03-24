// Declare game version once at the module level
const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Summoner Icon
export async function getSummonerIconUrl(profileIconId: string): Promise<string> {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/profileicon/${profileIconId}.png`;
}

// Champion Icon
export const getChampionIcon = (championName: string): string => {
    const formattedName: string = championName.replace(/[^a-zA-Z]/g, ""); // Remove special characters

    const fixString = (input: string): string => {
        return input === "FiddleSticks" ? "Fiddlesticks" : input;
    };

    const fixedName : string = fixString(formattedName); // Apply fixString function

    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/champion/${fixedName}.png`;
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

// Augment Icon
export async function getAugmentImageUrl(augmentPath : string): Promise<string> {
    return "https://raw.communitydragon.org/latest/game/" + augmentPath;
}