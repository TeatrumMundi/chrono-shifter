"use client";

import {FormatResponseReturn, MatchResponse, ProcessedParticipant} from "@/types/interfaces";
import {getParticipantByPuuid, queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helper";
import {useEffect, useMemo, useState} from "react";
import {getChampionIcon, getItemIcon, getRuneImageUrl} from "@/utils/leagueAssets";
import Image from "next/image";

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

function MatchCard({ participant, match }: { participant: ProcessedParticipant; match: MatchResponse; index: number }) {
    const [runeImageUrls, setRuneImageUrls] = useState<string[]>([]); // Use an array to store all rune URLs

    useEffect(() => {
        // Map through all runes and get their image URLs
        Promise.all(participant.runes.map(rune => getRuneImageUrl(rune.icon)))
            .then(setRuneImageUrls); // Update state with all rune URLs
    }, [participant.runes]);

    return (
        <div className="p-5 bg-gray-800/80 rounded-xl shadow-lg transition-transform transform hover:scale-105 font-sans">
            <div className="flex">
                {/* Left side - Match summary */}
                <div className="w-[15%] pr-2 border-r border-gray-700 flex flex-col justify-center items-center text-center">
                    <div className="text-lg font-semibold text-gray-200">
                        {queueIdToGameMode[match.queueId]}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                        {timeAgo(match.gameEndTimestamp)}
                    </div>
                    <div className={`mt-1 text-base font-medium ${participant.win ? "text-green-500" : "text-red-500"}`}>
                        {participant.win ? "Win" : "Loss"}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                        {secToHHMMSS(match.gameDuration)}
                    </div>
                </div>

                {/* Right side - Match details */}
                <div className="flex flex-row ml-2 flex-1">
                    {/* Match details */}
                    <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm flex-1">
                        <MatchDetail label="Champion" value={getChampionIcon(participant.championName)} isImage={true} />
                        <MatchDetail label="KDA" value={`${participant.kills}/${participant.deaths}/${participant.assists} (${participant.kda})`} />
                        <MatchDetail label="Role" value={participant.teamPosition} />
                        <MatchDetail label="Damage" value={participant.damageDealt.toString()} />
                        <MatchDetail label="Gold Earned" value={participant.goldEarned.toString()} />
                        <MatchDetail label="Vision Score" value={participant.visionScore.toString()} />
                        <MatchDetail label="Minions" value={`${participant.minionsKilled} (${participant.minionsPerMinute})`} />

                        {/* Runes section */}
                        <div className="col-span-2">
                            <p className="font-semibold text-gray-300">Runes:</p>
                            <div className="flex flex-row gap-2 mt-1">
                                {runeImageUrls.map((runeUrl, index) => (
                                    <Image
                                        key={index}
                                        src={runeUrl}
                                        alt={`Rune ${index + 1}`}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Add Items section */}
                        <div className="col-span-2 mt-2">
                            <p className="font-semibold text-gray-300">Items:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {participant.items.map((itemId, idx) => (
                                    itemId > 0 ? (
                                        <Image
                                            key={idx}
                                            src={getItemIcon(itemId)}
                                            alt={`Item ${itemId}`}
                                            width={32}
                                            height={32}
                                            className="rounded-md"
                                        />
                                    ) : (
                                        <div
                                            key={idx}
                                            className="w-8 h-8 bg-gray-700 rounded-md"
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Participants list */}
                    <div className="ml-4 border-l border-gray-700 pl-4 w-1/3">
                        <ParticipantList participants={match.participants} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MatchDetail({ label, value, fullWidth = false, isImage = false }: { label: string; value: string; fullWidth?: boolean; isImage?: boolean }) {
    return (
        <p className={`font-semibold text-gray-300 ${fullWidth ? "col-span-2" : ""}`}>
            {label}: {isImage ? (
            <Image
                src={value}
                alt={label}
                width={32}
                height={32}
                className="inline-block rounded-full"
            />
        ) : (
            <span className="text-gray-400">{value}</span>
        )}
        </p>
    );
}


function ParticipantList({ participants }: { participants: ProcessedParticipant[] }) {
    return (
        <div className="text-sm text-gray-400">
            <p className="font-semibold text-gray-300 mb-2">Participants:</p>
            <div className="flex flex-col gap-2">
                {participants.slice(0, 5).map((player, i) => (
                    <div key={i} className="flex">
                        <span className="inline-block w-[45%] text-right truncate">{player.riotIdGameName}</span>
                        <span className="inline-block w-[10%] text-center font-medium text-gray-500">vs</span>
                        <span className="inline-block w-[45%] truncate">{participants[i + 5]?.riotIdGameName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
