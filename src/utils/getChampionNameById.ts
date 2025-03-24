/**
 * Fetches the champion name by its unique champion ID from the League of Legends data dragon API.
 *
 * @param {number} championId - The unique ID of the champion (e.g., 1 for Annie, 2 for Olaf).
 * @returns {Promise<string | null>} A promise that resolves to the champion's name if found, or `null` if no champion is found or an error occurs.
 *
 * @throws {Error} Throws an error if there is an issue fetching the champion data from the API.
 */
export async function getChampionNameById(championId: number): Promise<string | null> {
    const version = "15.6.1"; // Use the latest version of the game
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

    try {
        // Fetch the champion data from the Dragon API for the specified version
        const response: Response = await fetch(url);

        // Parse the JSON response
        const data = await response.json();

        // Iterate over the champions to find the matching champion ID
        for (const champKey in data.data) {
            const champ = data.data[champKey];
            if (parseInt(champ.key, 10) === championId) {
                return champ.name; // Return the champion name if a match is found
            }
        }

        // Return null if no champion matches the ID
        return null;
    } catch (error) {
        // Log any errors and return null if an error occurs
        console.error("Error fetching champion data:", error);
        return null;
    }
}
