import { promises as fs } from "fs";
import { Champion } from "@/types/interfaces";
import {getAssetPath} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAssetPath";

/**
 * Loads and returns a Champion object from local champions.json by its ID.
 */
export async function getChampionById(id: number): Promise<Champion | undefined> {
    try {
        const filePath : string = getAssetPath("champions.json")

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const champions: Champion[] = JSON.parse(raw.replace(/^\uFEFF/, ""));

        return champions.find((champion) => champion.id === id);
    } catch (error) {
        console.error(`Failed to load champion ID ${id}:`, error);
        return undefined;
    }
}
