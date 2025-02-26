"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData";
import { secToHHMMSS, timeAgo } from "@/app/apiiHandler/helper";
import { SummonerData} from "@/app/apiiHandler/Interfaces/interfaces";



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

            <h2>Flex Rank: {data.flexTier ?? "Unranked"} {data.flexRank ?? ""} {data.flexWins}:{data.flexLosses} WR {data.flexWR}% {data.flexLP}LP</h2>
            <h3>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</h3>
            <h4>LAST GAME of {data.match[0].participants[9].riotIdGameName} ({data.match[0].participants[9].win}):</h4>
            <h4>You played: {data.match[0].participants[9].championName}</h4>
            <h4>You played: {data.match[0].gameMode}</h4>
            <h4>Your role: {data.match[0].participants[9].teamPosition}</h4>
            <h4>Time: {secToHHMMSS(data.match[0].gameDuration)}</h4>
            <h4>Match played: {timeAgo(data.match[0].gameEndTimestamp)}</h4>
            <h4></h4>
            <h4></h4>
            <h4></h4>
        </div>
    );
}
