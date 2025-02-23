import {
    fetchAccountInfo,
    fetchSummonerInfo
} from "./apiDestructor";

export async function fetchAllData() {
    try {
        const [puuid, gameName, tagLine] = await fetchAccountInfo(`europe`, `kast220`, `eune`);
        const [id, profileIconID, summonerLevel] = await fetchSummonerInfo('eun1', puuid);

        return { puuid, gameName, tagLine, profileIconID, summonerLevel, id };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null if an error occurs
    }
}
