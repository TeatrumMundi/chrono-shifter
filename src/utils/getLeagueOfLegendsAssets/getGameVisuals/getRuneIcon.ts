// Rune Icon
export async function getRuneImageUrl(runePath: string): Promise<string> {
    // Base URL for Data Dragon where rune data is stored
    const ddragonBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";

    // Full URL to access the image
    const imageUrl = `${ddragonBaseUrl}${runePath}`;

    try {
        // Checking if the image exists
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
            return imageUrl;
        }
    } catch (error) {
        console.error(error);
        return `Rune image not found: ${imageUrl}`;
    }

    return `Rune image not found: ${imageUrl}`;
}