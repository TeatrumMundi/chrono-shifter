import { promises as fs } from "fs";
import { Item } from "@/types/ProcessedInterfaces";
import {getAssetPath} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAssetPath";

/**
 * Loads and returns an Item object from local items.json by its ID.
 */
export async function getItemById(itemId: number): Promise<Item | undefined> {
    try {
        const filePath = getAssetPath("items.json")

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));

        return parsed.find((item: Item) => item.id === itemId);
    } catch (error) {
        console.error(`Failed to load item ID ${itemId}:`, error);
        return undefined;
    }
}