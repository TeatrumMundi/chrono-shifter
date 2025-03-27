import {promises as fs} from "fs";
import {Augment} from "@/types/interfaces";
import {getAssetPath} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAssetPath";

/**
 * Load an augment from local augments.json by its ID.
 * Returns the full Augment object if found.
 */
export async function getAugmentById(id: number): Promise<Augment | undefined> {
    try {
        const filePath = getAssetPath("augments.json");

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")); // Remove BOM if present

        return parsed.augments.find((augment: Augment) => augment.id === id);
    } catch (error) {
        console.error(`Failed to load augment ID ${id}:`, error);
        return undefined;
    }
}
