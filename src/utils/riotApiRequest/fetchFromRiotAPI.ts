﻿/**
 * Fetches data from the Riot Games API with the provided endpoint.
 *
 * @param {string} endpoint - The endpoint URL to fetch data from the Riot Games API.
 * @returns {Promise<Response>} A promise that resolves to the response from the Riot API.
 *
 * @throws {Error} Throws an error if the Riot API key is missing or there is an issue with the request.
 */
export async function fetchFromRiotAPI(endpoint: string): Promise<Response> {
    // Retrieve the Riot API key from environment variables
    const riotApiKey = process.env.RIOT_API_KEY;

    // Check if the Riot API key is missing
    if (!riotApiKey) {
        return new Response(JSON.stringify({ error: "Riot API key is missing" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        // Make the request to the Riot API with the API key and content type header
        const response = await fetch(endpoint, {
            headers: {
                "X-Riot-Token": riotApiKey, // Set the Riot API token in the header
                "Content-Type": "application/json", // Set content type to JSON
            },
        });

        // If the response is not OK, return a custom error message with the status
        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch data from Riot API", status: response.status }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Return the response data in JSON format with a 200 OK status
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        // Return an error response if an exception occurs during the fetch request
        return new Response(JSON.stringify({ error: "An error occurred while fetching data", details: (error as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}