"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAllData } from "@/app/apiiHandler/fetchAllData";
import { secToHHMMSS, timeAgo, getParticipantByPuuid } from "@/app/apiiHandler/helper";
import { SummonerData, ProcessedParticipant } from "@/app/apiiHandler/Interfaces/interfaces";

export default function Home() {
    const [data, setData] = useState<SummonerData | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const name = searchParams.get("name");
    const tag = searchParams.get("tag");

    const loadData = useCallback(async () => {
        if (!server || !name || !tag) {
            setLoading(false);
            return;
        }
        try {
            const fetchedData = await fetchAllData(server, name, tag);
            setData(fetchedData ?? null);
        } finally {
            setLoading(false);
        }
    }, [server, name, tag]);

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, [loadData]);

    if (loading) return <h2 className="text-center text-xl font-semibold mt-10">Loading...</h2>;
    if (!data) return <h2 className="text-center text-xl font-semibold mt-10">No data available</h2>;

    const mainPlayerMatches = data.match
        .map(match => getParticipantByPuuid(match, data.puuid))
        .filter((participant): participant is ProcessedParticipant => participant !== null);

    if (mainPlayerMatches.length === 0)
        return <h2 className="text-center text-xl font-semibold mt-10">No match data found for this player.</h2>;

    return (
        <div className="max-w-4xl mx-auto p-5 tracking-widest">
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">{data.gameName}#{data.tagLine}</h2>
                <p className="text-lg">Level: {data.summonerLevel}</p>
                <p className="text-lg">Profile Icon ID: {data.profileIconId}</p>

                <div className="mt-5">
                    <h3 className="text-xl font-semibold">Solo Rank:</h3>
                    <p>{data.soloTier ?? "Unranked"} {data.soloRank ?? ""}</p>
                    <p>{data.soloWins}:{data.soloLosses} WR {data.soloWR}% {data.soloLP}LP</p>
                </div>

                <div className="mt-5">
                    <h3 className="text-xl font-semibold">Flex Rank:</h3>
                    <p>{data.flexTier ?? "Unranked"} {data.flexRank ?? ""} {data.flexWins}:{data.flexLosses} WR {data.flexWR}% {data.flexLP}LP</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-8">Recent Matches:</h2>
            {mainPlayerMatches.map((participant, index) => (
                <div key={index} className="bg-gray-800 text-white p-4 rounded-lg mt-4 shadow-md">
                    <h4 className="text-lg font-bold">Match {index + 1}: {participant.riotIdGameName} ({participant.win ? "Win" : "Loss"})</h4>
                    <p>Champion: {participant.championName} | KDA: {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})</p>
                    <p>Game Mode: {data.match[index].gameMode} | Role: {participant.teamPosition}</p>
                    <p>Duration: {secToHHMMSS(data.match[index].gameDuration)}</p>
                    <p>Match played: {timeAgo(data.match[index].gameEndTimestamp)}</p>
                    <p>Damage: {participant.damageDealt} | Gold: {participant.goldEarned}</p>
                    <p>Runes: {participant.runes.join(", ")}</p>
                    <p>Vision Score: {participant.visionScore}</p>
                    <p>Minions: {participant.minionsKilled} | {participant.minionsPerMinute} per minute</p>
                    <div className="mt-3">
                        <h4 className="text-md font-semibold">Matchup:</h4>
                        {[...Array(5)].map((_, i) => (
                            <p key={i}>
                                {data.match[index].participants[i].riotIdGameName} vs {data.match[index].participants[i + 5].riotIdGameName}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
