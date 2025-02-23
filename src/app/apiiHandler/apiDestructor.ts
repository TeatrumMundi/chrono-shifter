const defaultUrl = `http://localhost:3000/api`;

async function fetchAccountData(region: string, gameName: string, tagLine: string) {
    try {
        const response = await fetch(`${defaultUrl}/account/by-riot-id/?region=${region}&gameName=${gameName}&tag=${tagLine}`);

        if (!response.ok) {
            return new Error(`Failed to fetch account data. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching account data: ${error}`);
    }
}

async function fetchSummonerData(server: string, puuid: string) {
    try {
        const response = await fetch(`${defaultUrl}/summoner/by-puuid/?server=${server}&puuid=${puuid}`);

        if (!response.ok) {
            return new Error(`Failed to fetch summoner data. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching summoner data: ${error}`);
    }
}
export async function fetchAccountInfo(region: string, gameName: string, tagLine: string): Promise<[string, string, string]> {
    const data = await fetchAccountData(region, gameName, tagLine);
    return [data.puuid, data.gameName, data.tagLine];
}

export async function fetchSummonerInfo(server: string, puuid: string): Promise<[string, string, string]> {
    const data = await fetchSummonerData(server, puuid);
    return [data.id, data.profileIconId, data.summonerLevel]
}
