export async function getChampionNameById(championId: number): Promise<string | null> {
    const version = "14.5.1"; // Use the latest version of the game
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Iterate over the champions to find the matching ID
        for (const champKey in data.data) {
            const champ = data.data[champKey];
            if (parseInt(champ.key, 10) === championId) {
                return champ.name; // Return champion name
            }
        }
        return null; // Return null if no champion found
    } catch (error) {
        console.error("Error fetching champion data:", error);
        return null;
    }
}