"use client";

import { FormatResponseReturn, MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import {getParticipantByPuuid, queueIdToGameMode, secToHHMMSS, timeAgo} from "@/utils/helper";
import { useMemo } from "react";

export function MatchList({ data, puuid }: { data: FormatResponseReturn; puuid: string }) {
    const mainPlayerMatches = useMemo(
        () =>
            data.match
                .map((match: MatchResponse) => getParticipantByPuuid(match, puuid))
                .filter((participant): participant is ProcessedParticipant => participant !== null),
        [data, puuid]
    );

    if (mainPlayerMatches.length === 0) {
        return (
            <div className="col-span-12 p-6 bg-gray-800/80 rounded-xl mt-4 text-gray-300 text-center tracking-[.25em]">
                No match data found for this player.
            </div>
        );
    }

    return (
        <>
            <h3 className="mt-6 text-lg font-semibold border-b border-gray-700 pb-2 text-gray-200 tracking-[.25em]">
                Recent Matches
            </h3>
            <div className="grid grid-cols-1 gap-4 tracking-[.25em]">
                {mainPlayerMatches.map((participant, index) => (
                    <MatchCard key={index} participant={participant} match={data.match[index]} index={index} />
                ))}
            </div>
        </>
    );
}

function MatchCard({ participant, match, index }: { participant: ProcessedParticipant; match: MatchResponse; index: number }) {
    return (
        <div className="p-5 bg-gray-800/80 rounded-xl shadow-lg transition-transform transform hover:scale-105 font-sans">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-200">
                    Match {index + 1}: {participant.riotIdGameName}
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${participant.win ? "bg-green-500" : "bg-red-500"} text-white`}>
                    {participant.win ? "Win" : "Loss"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-gray-400 text-sm">
                <MatchDetail label="Champion" value={participant.championName} />
                <MatchDetail label="KDA" value={`${participant.kills}/${participant.deaths}/${participant.assists} (${participant.kda})`} />
                <MatchDetail label="Game Mode" value={match.gameMode} />
                <MatchDetail label="QueueId" value={queueIdToGameMode[match.queueId]} />
                <MatchDetail label="Role" value={participant.teamPosition} />
                <MatchDetail label="Duration" value={secToHHMMSS(match.gameDuration)} />
                <MatchDetail label="Played" value={timeAgo(match.gameEndTimestamp)} />
                <MatchDetail label="Damage" value={participant.damageDealt.toString()} />
                <MatchDetail label="Gold Earned" value={participant.goldEarned.toString()} />
                <MatchDetail label="Vision Score" value={participant.visionScore.toString()} />
                <MatchDetail label="Minions" value={`${participant.minionsKilled} (${participant.minionsPerMinute})`} />
                <MatchDetail label="Runes" value={participant.runes.join(", ")} fullWidth />
            </div>

            <ParticipantList participants={match.participants} />
        </div>
    );
}

function MatchDetail({ label, value, fullWidth = false }: { label: string; value: string; fullWidth?: boolean }) {
    return (
        <p className={`font-semibold text-gray-300 ${fullWidth ? "col-span-2" : ""}`}>
            {label}: <span className="text-gray-400">{value}</span>
        </p>
    );
}

function ParticipantList({ participants }: { participants: ProcessedParticipant[] }) {
    return (
        <div className="mt-4 border-t border-gray-700 pt-3 text-sm text-gray-400">
            <p className="font-semibold text-gray-300">Participants:</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
                {participants.slice(0, 5).map((player, i) => (
                    <p key={i}>
                        {player.riotIdGameName} vs {participants[i + 5]?.riotIdGameName}
                    </p>
                ))}
            </div>
        </div>
    );
}
