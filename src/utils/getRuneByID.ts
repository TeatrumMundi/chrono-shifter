import {Rune, RunePath} from "@/types/interfaces";


async function fetchRunesData(): Promise<RunePath[]> {
    try {
        const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.6.1/data/en_US/runesReforged.json');

        return await response.json() as RunePath[];
    } catch (error) {
        console.error('Error fetching runes data:', error);
        throw error;
    }
}

function findRuneById(runesData: RunePath[], runeId: number): Rune | null {
    for (const path of runesData) {
        if (path.id === runeId) {
            return {
                id: path.id,
                key: path.key,
                icon: path.icon,
                name: path.name,
                shortDesc: '',
                longDesc: ''
            };
        }

        for (const slot of path.slots) {
            for (const rune of slot.runes) {
                if (rune.id === runeId) {
                    return rune;
                }
            }
        }
    }
    return null;
}

export async function getRuneById(runeId: number): Promise<Rune | null> {
    try {
        const runesData = await fetchRunesData();
        return findRuneById(runesData, runeId);
    } catch (error) {
        console.error('Error getting rune by ID:', error);
        throw error;
    }
}