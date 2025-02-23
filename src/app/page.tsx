"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData"; // Import the function

export default function Home() {
    const [data, setData] = useState<
        { puuid: string; gameName: string; tagLine: string; profileIconID: string; summonerLevel: string; id: string } | null>(null);

    useEffect(() => {
        async function loadData() {
            const fetchedData = await fetchAllData();
            setData(fetchedData);
        }

        loadData();
    }, []);

    return (
        <div>
            <h1>Hello World!</h1>
            {data ? (
                <>
                    <h2>Your puuid is: {data.puuid}</h2>
                    <h2>Your game name is: {data.gameName}</h2>
                    <h2>Your tag is: {data.tagLine}</h2>
                    <h2>Your profileIconID is: {data.profileIconID}</h2>
                    <h2>Your summonerLevel is: {data.summonerLevel}</h2>
                    <h2>Your summonerID is: {data.id}</h2>
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}
