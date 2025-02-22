import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const puuid = searchParams.get("puuid");

    if (!(region && puuid)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    return fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`);
}
