"use client";

import { ProcessedParticipant } from "@/types/ProcessedInterfaces";
import {ChampionIcon} from "@/components/profile";

interface MatchStatsBarProps {
    matches: { participant: ProcessedParticipant }[];
}

export function MatchStatsBar({ matches }: MatchStatsBarProps) {
    if (matches.length === 0) return null;

    const totalKills = matches.reduce((sum, e) => sum + e.participant.kills, 0);
    const totalDeaths = matches.reduce((sum, e) => sum + e.participant.deaths, 0);
    const totalAssists = matches.reduce((sum, e) => sum + e.participant.assists, 0);
    const totalGames = matches.length;
    const totalWins = matches.filter((e) => e.participant.win).length;

    const kdaRatio = totalDeaths === 0 ? totalKills + totalAssists : (totalKills + totalAssists) / totalDeaths;
    const overallWR = Math.round((totalWins / totalGames) * 100);

    const championStats: Record<string, {
        games: number;
        wins: number;
        kills: number;
        deaths: number;
        assists: number;
        champion: ProcessedParticipant["champion"];
    }> = {};

    for (const { participant } of matches) {
        const champ = participant.champion.name;
        if (!championStats[champ]) {
            championStats[champ] = {
                games: 0,
                wins: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
                champion: participant.champion
            };
        }
        championStats[champ].games++;
        championStats[champ].wins += participant.win ? 1 : 0;
        championStats[champ].kills += participant.kills;
        championStats[champ].deaths += participant.deaths;
        championStats[champ].assists += participant.assists;
    }

    const topChamps = Object.entries(championStats)
        .sort((a, b) => b[1].games - a[1].games)
        .slice(0, 3);

    const getWinrateColor = (wr: number) => {
        if (wr >= 65) return "text-yellow-400"; // gold
        if (wr >= 50) return "text-white";
        return "text-red-500";
    };

    const getKDAColor = (kda: number) => {
        if (kda >= 4) return "text-yellow-400"; // gold
        if (kda >= 2.5) return "text-white";
        return "text-red-500";
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-4 bg-gray-800/80 px-4 py-2 rounded-lg text-white font-sans">
                <div className="flex flex-col items-center text-center text-sm font-semibold">
                    <span>{overallWR}% WR</span>
                    <span className="text-xs text-gray-400">Last {totalGames} games</span>
                </div>
                <div className="flex flex-col items-center text-center text-sm font-semibold">
                    <span>{kdaRatio.toFixed(2)} KDA</span>
                    <span className="text-xs text-gray-400">
                    {(totalKills / totalGames).toFixed(1)} / {(totalDeaths / totalGames).toFixed(1)} / {(totalAssists / totalGames).toFixed(1)}
                </span>
                </div>

                {topChamps.map(([champName, stats]) => {
                    const champKDA = stats.deaths === 0 ? stats.kills + stats.assists : (stats.kills + stats.assists) / stats.deaths;
                    const winrate = Math.round((stats.wins / stats.games) * 100);

                    return (
                        <div key={champName} className="flex items-center gap-2 text-sm font-semibold bg-gray-900 rounded-sm px-2 py-1">
                            <div className="shrink-0">
                                <ChampionIcon champion={stats.champion} size={40} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className={`text-xs font-medium ${getWinrateColor(winrate)}`}>{winrate}% ({stats.wins}W {stats.games - stats.wins}L)</span>
                                <span className={`text-xs font-medium ${getKDAColor(champKDA)}`}>{champKDA.toFixed(2)} KDA</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
