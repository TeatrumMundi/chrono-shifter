import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const matchID = searchParams.get("matchID");

    if (!(region && matchID)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    return fetchFromRiotAPI(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`);
}
