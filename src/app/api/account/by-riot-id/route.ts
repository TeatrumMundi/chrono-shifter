import { fetchFromRiotAPI } from "@/app/apiiHandler/fetchFromRiotAPI";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const gameName = searchParams.get("gameName");
    const tag = searchParams.get("tag");

    if (!(region && gameName && tag)) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    return fetchFromRiotAPI(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tag)}`);
}
