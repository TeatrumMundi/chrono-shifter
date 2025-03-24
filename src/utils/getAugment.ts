import { Augment, AugmentData } from "@/types/interfaces";

/**
 * Fetches augment data for a specific augment ID from the Community Dragon API.
 * The API provides data related to the TFT (Teamfight Tactics) augments.
 *
 * @param {number} id - The unique ID of the augment to fetch.
 * @returns {Promise<Augment | undefined>} A promise that resolves to the augment data if found, or `undefined` if the augment with the given ID is not found or if an error occurs.
 *
 * @throws {Error} Throws an error if there is an issue with fetching the augment data from the API.
 */
export async function fetchAugmentById(id: number): Promise<Augment | undefined> {
    try {
        // Fetch the augment data from the Community Dragon API
        const response : Response = await fetch("https://raw.communitydragon.org/latest/cdragon/arena/en_us.json");

        // If the response is not successful, log an error and return undefined
        if (!response.ok) {
            console.error("Failed to fetch augment data");
            return undefined;
        }

        // Parse the JSON response containing the augment data
        const data: AugmentData = await response.json();

        // Find and return the augment with the matching ID, or undefined if not found
        return data.augments.find((augment: Augment) => augment.id === id);
    } catch (error) {
        // Log the error and return undefined if an issue occurs during the fetch or processing
        console.error("Error fetching augment data:", error);
        return undefined;
    }
}
