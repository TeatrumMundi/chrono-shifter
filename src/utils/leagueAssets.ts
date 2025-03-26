const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Champion Icon
export const getChampionIcon = (championID: number): string => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championID}.png`;
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