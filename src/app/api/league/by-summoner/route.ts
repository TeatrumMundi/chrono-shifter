import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const server = searchParams.get("server");
    const summonerID = searchParams.get("summonerID");

    if (!(server && summonerID)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    return fetchFromRiotAPI(`https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}`);
}
