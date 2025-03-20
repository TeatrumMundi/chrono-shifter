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
    // Szukamy we wszystkich ścieżkach run
    for (const path of runesData) {
        // Sprawdzamy, czy sama ścieżka ma szukane ID
        if (path.id === runeId) {
            return {
                id: path.id,
                key: path.key,
                icon: path.icon,
                name: path.name,
                shortDesc: '', // Ścieżki nie mają tych pól, więc zostawiamy puste
                longDesc: ''
            };
        }

        // Przeszukujemy wszystkie sloty w danej ścieżce
        for (const slot of path.slots) {
            // Przeszukujemy wszystkie runy w danym slocie
            for (const rune of slot.runes) {
                if (rune.id === runeId) {
                    return rune;
                }
            }
        }
    }

    // Jeśli nie znaleziono runy o danym ID
    return null;
}

// Główna funkcja, która pobiera dane i zwraca runę po ID
export async function getRuneById(runeId: number): Promise<Rune | null> {
    try {
        const runesData = await fetchRunesData();
        return findRuneById(runesData, runeId);
    } catch (error) {
        console.error('Error getting rune by ID:', error);
        throw error;
    }
}