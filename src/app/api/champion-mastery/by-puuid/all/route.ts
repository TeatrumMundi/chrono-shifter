import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const server = searchParams.get("server");
    const puuid = searchParams.get("puuid");

    if (!(server && puuid)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    return fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/champion-mastery/v4/scores/by-puuid/${puuid}`);
}
