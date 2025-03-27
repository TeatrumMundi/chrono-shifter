import {Rune} from "@/types/interfaces";

const CDN_BASE =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1";

const runeTreeToImageMap: Record<string, string> = {
    Domination: "7200_domination.png",
    Precision: "7201_precision.png",
    Sorcery: "7202_sorcery.png",
    Inspiration: "7203_whimsy.png",
    Resolve: "7204_resolve.png"
};

/**
 * Returns the full URL to the rune's own icon.
 */
export function getRuneIconUrl(rune: Rune): string {
    const normalizedPath = rune.iconPath
        .replace("/lol-game-data/assets/v1", "")
        .toLowerCase();

    return `${CDN_BASE}${normalizedPath}`;
}

/**
 * Returns the full URL to the rune tree icon (Domination, Precision, etc.)
 */
export function getRuneTreeIconUrl(rune: Rune): string | null {
    const treeMatch = rune.iconPath.match(/Styles\/([^/]+)\//i);
    const runeTree = treeMatch?.[1];

    if (!runeTree) return null;

    const filename = runeTreeToImageMap[runeTree];
    if (!filename) return null;

    return `${CDN_BASE}/perk-images/styles/${filename}`;
}
