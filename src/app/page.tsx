"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData";
import {ProcessedParticipant} from "@/app/apiiHandler/apiDestructor";

interface SummonerData {
    gameName: string;
    tagLine: string;
    profileIconId: string;
    summonerLevel: string;
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
    matchDetails: ProcessedParticipant[];
}

export default function Home() {
    const [data, setData] = useState<SummonerData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try
        {
            const fetchedData = await fetchAllData("EUNE", "Monovaqovsky", "eune");
            setData(fetchedData ?? null);
        } finally
        {
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
            <h2>Profile Icon ID: {data.profileIconId}</h2>

            <h2>Solo Rank: {data.soloTier ?? "Unranked"} {data.soloRank ?? ""}</h2>
            <h3>{data.soloWins}:{data.soloLosses} WR {data.soloWR}% {data.soloLP}LP</h3>

            <h2>Flex Rank: {data.flexTier ?? "Unranked"} {data.flexRank ?? ""}</h2>
            <h3>{data.flexWins}:{data.flexLosses} WR {data.flexWR}% {data.flexLP}LP</h3>

            <h4>Your last game KDA: {data.matchDetails[9].kills}/{data.matchDetails[9].deaths}/{data.matchDetails[9].assists}</h4>
            <h4>Damage dealt: {data.matchDetails[9].damageDealt}</h4>
            <h4>Gold earned: {data.matchDetails[9].goldEarned}</h4>
            <h4>Ward placed: {data.matchDetails[9].wardsPlaced}</h4>
        </div>
    );
}
