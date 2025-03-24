import { Rune, RunePath } from "@/types/interfaces";

// Declare game version once at the module level
const GAME_VERSION: string = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Cache to store runes data and avoid multiple API calls
let cachedRunesData: RunePath[] | null = null;

/**
 * Fetches the runes data from the League of Legends Dragon API.
 * This function retrieves rune data, including rune paths and rune details, for a specific game version.
 * The fetched data is cached to avoid repeated API calls.
 *
 * @returns {Promise<RunePath[]>} A promise that resolves to an array of `RunePath` objects representing rune data.
 * @throws {Error} Throws an error if there is an issue with fetching the runes data.
 */
async function fetchRunesData(): Promise<RunePath[]> {
    // If runes data is cached, return it directly
    if (cachedRunesData) { return cachedRunesData; }

    try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/data/en_US/runesReforged.json`);

        const data = await response.json() as RunePath[];

        // Cache the runes data for future use
        cachedRunesData = data;
        return data;
    } catch (error) {
        console.error('Error fetching runes data:', error);
        throw error;
    }
}

/**
 * Finds a rune by its ID in the provided runes data.
 * This function looks through both rune paths and their respective slots to find the correct rune.
 * It uses the `find()` method for optimized searching.
 *
 * @param {RunePath[]} runesData - The array of `RunePath` objects containing all the rune data.
 * @param {number} runeId - The unique ID of the rune to find.
 * @returns {Rune | null} The `Rune` object matching the provided `runeId`, or `null` if not found.
 */
function findRuneById(runesData: RunePath[], runeId: number): Rune | null {
    // Find the path containing the rune using the `find()` method
    const path = runesData.find(path => path.id === runeId);

    // If the path is found, return it directly
    if (path) {
        return {
            id: path.id,
            key: path.key,
            icon: path.icon,
            name: path.name,
            shortDesc: '',
            longDesc: '',
            runePath: {
                id: path.id,
                key: path.key,
                icon: path.icon,
                name: path.name
            }
        };
    }

    // Otherwise, search for the rune within the slots and runes
    for (const path of runesData) {
        for (const slot of path.slots) {
            const rune = slot.runes.find(rune => rune.id === runeId);
            if (rune) {
                return {
                    ...rune,
                    runePath: {
                        id: path.id,
                        key: path.key,
                        icon: path.icon,
                        name: path.name
                    }
                };
            }
        }
    }

    // Return null if no rune was found
    return null;
}

/**
 * Fetches rune data and finds the specific rune by its ID.
 * This function fetches the runes data from the API and then searches for the rune by its ID.
 * The fetched data is cached to improve performance for repeated requests.
 *
 * @param {number} runeId - The unique ID of the rune to find.
 * @returns {Promise<Rune | null>} A promise that resolves to the `Rune` object if found, or `null` if not found.
 * @throws {Error} Throws an error if there is an issue with fetching or processing the rune data.
 */
export async function getRuneById(runeId: number): Promise<Rune | null> {
    try {
        // Fetch runes data from the API and find the rune by ID
        const runesData = await fetchRunesData();
        return findRuneById(runesData, runeId);
    } catch (error) {
        console.error('Error getting rune by ID:', error);
        throw error;
    }
}
