"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData";

interface SummonerData {
    puuid: string;
    gameName: string;
    tagLine: string;
    profileIconID: string;
    summonerLevel: string;
    id: string;
    soloTier?: string;
    soloRank?: string;
    soloWins: number;
    soloLosses: number;
    soloLP: number;
    soloWR: number;
    flexTier?: string;
    flexRank?: string;
    flexWins: number;
    flexLosses: number;
    flexLP: number;
    flexWR: number;
    matches: string[];
}

export default function Home() {
    const [data, setData] = useState<SummonerData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const fetchedData = await fetchAllData("EUNE", "Monovaqovsky", "eune");
            setData(fetchedData ?? null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, [loadData]);

    if (loading) return <h2>Loading...</h2>;
    if (!data) return <h2>No data available</h2>;

    return (
        <div>
            <h2>{data.gameName}#{data.tagLine} LVL: {data.summonerLevel}</h2>
            <h2>Profile Icon ID: {data.profileIconID}</h2>
            <h2>PUUID: {data.puuid}</h2>
            <h2>Summoner ID: {data.id}</h2>
            <h2>
                Solo Rank: {data.soloTier ?? "Unranked"} {data.soloRank ?? ""}
                {data.soloWins}:{data.soloLosses} WR {data.soloWR}% {data.soloLP}LP
            </h2>
            <h2>
                Flex Rank: {data.flexTier ?? "Unranked"} {data.flexRank ?? ""}
                {data.flexWins}:{data.flexLosses} WR {data.flexWR}% {data.flexLP}LP
            </h2>
            {data.matches.slice(0, 5).map((match, index) => (
                <h3 key={index}>{match}</h3>
            ))}
        </div>
    );
}
