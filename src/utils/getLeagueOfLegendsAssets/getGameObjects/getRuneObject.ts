import { promises as fs } from "fs";
import {Rune} from "@/types/interfaces";
import {getAssetPath} from "@/utils/getLeagueOfLegendsAssets/getGameObjects/getAssetPath";

export async function getRuneById(id: number): Promise<Rune | null> {
    const filePath = getAssetPath("runes.json");

    try {
        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const data: Rune[] = JSON.parse(raw.replace(/^\uFEFF/, ""));

        const match = data.find((r) => r.id === id);
        if (!match) return null;

        const runeTreeMatch = match.iconPath.match(/Styles\/([^/]+)\//);
        const runeTree = runeTreeMatch ? runeTreeMatch[1] : "Unknown";

        return {
            ...match,
            runeTree
        };
    } catch (err) {
        console.error("Failed to load rune:", err);
        return null;
    }
}