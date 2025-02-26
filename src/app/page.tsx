"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData";
import { secToHHMMSS, timeAgo, getParticipantByPuuid } from "@/app/apiiHandler/helper";
import { SummonerData, ProcessedParticipant } from "@/app/apiiHandler/Interfaces/interfaces";

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

    // ✅ Find the player in all matches
    const mainPlayerMatches = data.match
        .map(match => getParticipantByPuuid(match, data.puuid)) // Get the player's data from each match
        .filter((participant): participant is ProcessedParticipant => participant !== null); // Remove null values

    if (mainPlayerMatches.length === 0) return <h2>No match data found for this player.</h2>;


    return (
        <div>
            <h2>{data.gameName}#{data.tagLine} LVL: {data.summonerLevel}</h2>
            <h2>Profile Icon ID: {data.profileIconId}</h2>

            <h2>Solo Rank: {data.soloTier ?? "Unranked"} {data.soloRank ?? ""}</h2>
            <h3>{data.soloWins}:{data.soloLosses} WR {data.soloWR}% {data.soloLP}LP</h3>

            <h2>Flex Rank: {data.flexTier ?? "Unranked"} {data.flexRank ?? ""} {data.flexWins}:{data.flexLosses} WR {data.flexWR}% {data.flexLP}LP</h2>
            <h3>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</h3>

            <h2>Recent Matches:</h2>
            {mainPlayerMatches.map((participant, index) => (
                <div key={index}>
                    <h4>Match {index + 1}: {participant.riotIdGameName} ({participant.win ? "Win" : "Loss"})</h4>
                    <h4>Champion: {participant.championName}</h4>
                    <h4>Game Mode: {data.match[index].gameMode}</h4>
                    <h4>Role: {participant.teamPosition}</h4>
                    <h4>Time: {secToHHMMSS(data.match[index].gameDuration)}</h4>
                    <h4>Match played: {timeAgo(data.match[index].gameEndTimestamp)}</h4>
                    <hr />
                </div>
            ))}
        </div>
    );
}
