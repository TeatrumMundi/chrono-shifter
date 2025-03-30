import { Augment } from "@/types/ProcessedInterfaces";

/**
 * Returns the full URL to the augment icon from Community Dragon.
 * Falls back to public/augments if the CDN icon is not available or known to fail.
 * @param augment The augment object.
 * @param size Optional icon size: 'small' (default) or 'large'.
 * @returns A fully qualified image URL.
 */
export function getAugmentIconUrl(augment: Augment, size: "small" | "large" = "small"): string {
    const iconFile = augment.apiName.toLowerCase() + `_${size}.png`;

    const cdnUrl = `https://raw.communitydragon.org/latest/game/assets/ux/cherry/augments/icons/${iconFile}`;
    const localUrl = `/augments/${iconFile}`; // File stored in public/augments/

    // List of known broken CDN files – use local directly
    const alwaysLocal = new Set([
        "prismaticegg_small.png",
        "divineintervention_small.png",
        "ultimateroulette_small.png",
        "dreadbringer_small.png"
    ]);

    // If the icon is known to fail on CDN, skip and return local only
    if (alwaysLocal.has(iconFile)) {
        return localUrl;
    }

    // Default behavior: return cdn#local fallback
    return `${cdnUrl}#${localUrl}`;
}
