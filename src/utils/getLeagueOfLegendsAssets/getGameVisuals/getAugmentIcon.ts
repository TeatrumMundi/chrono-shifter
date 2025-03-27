import { Augment } from "@/types/interfaces";

/**
 * Returns the full URL to the augment icon from Community Dragon.
 * @param augment The augment object.
 * @param size Optional icon size: 'small' (default) or 'large'.
 * @returns A fully qualified CDN image URL.
 */
export function getAugmentIconUrl(augment: Augment, size: "small" | "large" = "small"): string {
    const baseUrl =
        "https://raw.communitydragon.org/latest/game/assets/ux/cherry/augments/icons";

    const iconFile = augment.apiName.toLowerCase() + `_${size}.png`;

    return `${baseUrl}/${iconFile}`;
}