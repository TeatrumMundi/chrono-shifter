"use client"; // Required for client-side hooks

import { useEffect, useState, useCallback } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData"; // Import the function

type SummonerData = {
    puuid: string;
    gameName: string;
    tagLine: string;
    profileIconID: string;
    summonerLevel: string;
    id: string;
    soloTier?: string;
    soloRank?: string;
    soloWins: number,
    soloLosses: number,
    soloWR: number,
    flexTier?: string;
    flexRank?: string;
    flexWins: number,
    flexLosses: number,
    flexWR: number,
};

export default function Home() {
    const [data, setData] = useState<SummonerData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedData = await fetchAllData("eun1", "Teatrum Mundi", "GOD");
            if (!fetchedData) throw new Error("Failed to fetch data");
            setData(fetchedData);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div>
            <h1>Hello World!</h1>
            {loading ? (
                <h2>Loading...</h2>
            ) : error ? (
                <h2>Error: {error}</h2>
            ) : data ? (
                <>
                    <h2>Your puuid: {data.puuid}</h2>
                    <h2>Your game name: {data.gameName}</h2>
                    <h2>Your tag: {data.tagLine}</h2>
                    <h2>Your profileIconID: {data.profileIconID}</h2>
                    <h2>Your summonerLevel: {data.summonerLevel}</h2>
                    <h2>Your summonerID: {data.id}</h2>
                    <h2>Your solo rank: {data.soloTier ?? "Unranked"} {data.soloRank ?? ""}  {data.soloWins}:{data.soloLosses} WR{data.soloWR}%</h2>
                    <h2>Your flex rank: {data.flexTier ?? "Unranked"} {data.flexRank ?? ""}  {data.flexWins}:{data.flexLosses} WR{data.flexWR}%</h2>
                </>
            ) : (
                <h2>No data available</h2>
            )}
        </div>
    );
}
