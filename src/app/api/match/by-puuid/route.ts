import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

const queueMap: Record<string, number> = {
    NDraft: 400,
    SoloDuo: 420,
    SwiftPlay: 430,
    Flex: 440,
    ARAM: 450,
    Clash: 700,
    AI: 700,
    URF: 900,
    OneForAll: 1020,
    Tutorial: 2000,
};

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const puuid = searchParams.get("puuid");
    const queueType = searchParams.get("queueType");
    const number = searchParams.get("number");

    if (!(region && puuid && queueType && number)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Convert queueType to queue number
    const queueNumber = queueMap[queueType];

    if (queueNumber === undefined) {
        return Response.json({ error: "Invalid queueType provided" }, { status: 400 });
    }

    return fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queueNumber}&start=0&count=${number}`
    );
}
