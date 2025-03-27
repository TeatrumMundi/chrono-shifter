const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Champion Icon
export const getChampionIcon = (championID: number): string => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championID}.png`;
};

// Item Icon
export function getItemIcon(itemId: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/item/${itemId}.png`;
}

// Augment Icon
export async function getAugmentImageUrl(augmentPath : string): Promise<string> {
    return "https://raw.communitydragon.org/latest/game/" + augmentPath;
}