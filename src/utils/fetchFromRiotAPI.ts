export async function fetchFromRiotAPI(endpoint: string): Promise<Response> {
    const riotApiKey = process.env.RIOT_API_KEY;

    if (!riotApiKey) {
        return new Response(JSON.stringify({ error: "Riot API key is missing" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const response = await fetch(endpoint, {
            headers: {
                "X-Riot-Token": riotApiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch data from Riot API", status: response.status }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "An error occurred while fetching data", details: (error as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
