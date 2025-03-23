"use client";

import { FormatResponseReturn, MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import { getParticipantByPuuid, queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { getChampionIcon, getItemIcon, getRuneImageUrl } from "@/utils/leagueAssets";
import Image from "next/image";
import Link from "next/link";
import {BoxPlaceHolder} from "@/components/common";
import {ArenaParticipantList} from "@/components/profile/arena/ArenaParticipantList";
import {AugmentDisplay} from "@/components/profile/arena/AugmentDisplay";

export function MatchList({ data, puuid }: { data: FormatResponseReturn; puuid: string }) {
    const mainPlayerMatches = useMemo(
        () => data.match
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
                    <MatchCard
                        key={index}
                        participant={participant}
                        match={data.match[index]}
                        server={participant.server}
                    />
                ))}
            </div>
        </>
    );
}

function MatchDetail({label, value, fullWidth = false, isImage = false}: {
    label: string;
    value: string;
    fullWidth?: boolean;
    isImage?: boolean
}) {
    return (
        <p className={`font-semibold text-gray-300 ${fullWidth ? "col-span-2" : ""}`}>
            {label}: {
            isImage ? (
                <Image
                    src={value}
                    alt={label}
                    width={32}
                    height={32}
                    className="inline-block rounded-full"
                />
            ) : (<span className="text-gray-400">{value}</span>)}
        </p>
    );
}

function ParticipantList({participants, gameMode, server}: {
    participants: ProcessedParticipant[];
    gameMode: string;
    server: string;
}) {
    if (gameMode === "Arena") {
        return <ArenaParticipantList participants={participants} server={server} />;
    }

    return <StandardParticipantList participants={participants} server={server} />;
}

function StandardParticipantList({participants, server}: { participants: ProcessedParticipant[]; server: string; })
{
    return (
        <div className="text-sm text-gray-400 tracking-normal h-full">
            <div className="flex flex-col gap-1 justify-between h-full">
                {participants.slice(0, 5).map((player, i) => (
                    <div key={i} className="flex w-full">
                        <div className="flex items-center w-[49%] justify-end gap-1 bg-blue-900/30 p-2 rounded">
                            <Link
                                href={`/${server}/${player.riotIdGameName}/${player.riotIdTagline}`}
                                className="truncate text-sm hover:text-blue-400 transition-colors"
                            >
                                {player.riotIdGameName}
                            </Link>
                            <ChampionIcon championName={player.championName} size={20} />
                        </div>
                        <span className="inline-block w-[2%]"></span>
                        <div className="flex items-center w-[49%] gap-1 bg-red-900/30 p-2 rounded">
                            <ChampionIcon championName={participants[i + 5]?.championName} size={20} />
                            {participants[i + 5] && (
                                <Link
                                    href={`/${server}/${participants[i + 5].riotIdGameName}/${participants[i + 5].riotIdTagline}`}
                                    className="truncate text-sm hover:text-blue-400 transition-colors"
                                >
                                    {participants[i + 5].riotIdGameName}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Base ItemDisplay without augments
function StandardItemDisplay({ items }: { items: number[] }) {
    return (
        <div className="flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={startIdx} className="flex gap-2">
                    {items.slice(startIdx, startIdx + 3).map((itemId, index) => (
                        itemId > 0 ? (
                            <Image
                                key={`item-${startIdx}-${index}`}
                                src={getItemIcon(itemId)}
                                alt={`Item ${itemId}`}
                                width={32}
                                height={32}
                                className="rounded-md border border-gray-600"
                            />
                        ) : (
                            <BoxPlaceHolder key={`placeholder-${startIdx}-${index}`} />
                        )
                    ))}
                </div>
            ))}
        </div>
    );
}

// Combined display that conditionally shows augments for Arena mode
function ItemDisplay({ itemsIDs, gameMode, participant }: {
    itemsIDs: number[];
    gameMode: string;
    participant: ProcessedParticipant;
}) {
    const augments =
        gameMode === "Arena" && participant.arenaData
            ? participant.arenaData.playerAugments
            : [];

    return (
        <div className="flex gap-4">
            {/* Standard Items Section */}
            <StandardItemDisplay items={itemsIDs} />

            {/* Augments Section - Only for Arena mode */}
            {gameMode === "Arena" && augments.length > 0 && (
                <AugmentDisplay augments={augments} />
            )}
        </div>
    );

}

function RuneDisplay({primaryRuneUrl, runePathUrl}: { primaryRuneUrl: string; runePathUrl: string }) {
    if (!primaryRuneUrl && !runePathUrl) return null;

    return (
        <div className="flex flex-col items-center bg-gray-800 rounded-full p-1 border border-gray-600">
            {primaryRuneUrl && (
                <Image
                    src={primaryRuneUrl}
                    alt="Primary Rune"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            )}
            {runePathUrl && (
                <Image
                    src={runePathUrl}
                    alt="Rune Path"
                    width={20}
                    height={20}
                    className="rounded-full -mt-1"
                />
            )}
        </div>
    );
}

export function ChampionIcon({championName, size}: { championName: string; size: number }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                style={{ width: size, height: size }}
                className="bg-gray-900 rounded-full border border-gray-600 flex items-center justify-center text-gray-400"
            >
                ?
            </div>
        );
    }

    return (
        <Image
            src={getChampionIcon(championName)}
            alt={championName}
            width={size}
            height={size}
            className="rounded-full border border-gray-600"
            onError={() => setError(true)}
        />
    );
}

// Game-mode specific stat details
function MatchStats({ participant, gameMode }: { participant: ProcessedParticipant; gameMode: string; }) {
    // Common stats for all game modes
    const commonStats = (
        <>
            <MatchDetail
                label="KDA"
                value={`${participant.kills}/${participant.deaths}/${participant.assists} (${participant.kda})`}
            />
            {participant.teamPosition && (
                <MatchDetail label="Role" value={participant.teamPosition} />
            )}
            <MatchDetail label="Damage" value={participant.damageDealt.toString()} />
            <MatchDetail label="Gold Earned" value={participant.goldEarned.toString()} />
        </>
    );

    // Additional stats for standard game modes
    if (gameMode !== "Arena") {
        return (
            <>
                {commonStats}
                <MatchDetail label="Vision Score" value={participant.visionScore.toString()} />
                <MatchDetail
                    label="Minions"
                    value={`${participant.minionsKilled} (${participant.minionsPerMinute})`}
                />
            </>
        );
    }

    // Just return common stats for Arena mode
    return commonStats;
}

function MatchCard({ participant, match, server }: {
    participant: ProcessedParticipant;
    match: MatchResponse;
    server: string;
}) {
    const [runeInfo, setRuneInfo] = useState({
        primaryRuneUrl: '',
        runePathUrl: '',
        hasRunes: false
    });

    useEffect(() => {
        // Create an async function inside the useEffect
        const loadRuneInfo = async () => {
            if (!participant.runes?.length) {
                setRuneInfo({
                    primaryRuneUrl: '',
                    runePathUrl: '',
                    hasRunes: false
                });
                return;
            }

            const [firstRune] = participant.runes;
            const lastRune = participant.runes.at(-1);

            let primaryUrl = '';
            let pathUrl = '';

            try {
                if (firstRune?.icon) {
                    primaryUrl = await getRuneImageUrl(firstRune.icon);
                }

                if (lastRune?.runePath?.icon) {
                    pathUrl = await getRuneImageUrl(lastRune.runePath.icon);
                }
            } catch (error) {
                console.error("Error loading rune images:", error);
            }

            setRuneInfo({
                primaryRuneUrl: primaryUrl,
                runePathUrl: pathUrl,
                hasRunes: true
            });
        };

        // Call and await the async function
        void loadRuneInfo();
    }, [participant.runes]);

    const gameMode = queueIdToGameMode[match.queueId] || "Unknown";
    const winText = participant.win ? "Win" : "Loss";
    const winTextColor = participant.win ? "text-green-500" : "text-red-500";

    return (
        <div className="p-5 bg-gray-800/80 rounded-xl shadow-lg transition-transform transform hover:scale-105 font-sans">
            <div className="flex items-center">
                {/* Left: Match Summary */}
                <div className="w-[15%] pr-2 border-r border-gray-700 flex flex-col items-center text-center">
                    <div className="text-lg font-semibold text-gray-200">{gameMode}</div>
                    <div className="text-gray-400 text-xs mt-1">{timeAgo(match.gameEndTimestamp)}</div>
                    <div className={`mt-1 text-base font-medium ${winTextColor}`}>{winText}</div>
                    <div className="text-gray-400 text-xs mt-1">{secToHHMMSS(match.gameDuration)}</div>
                </div>

                {/* Right: Match Details */}
                <div className="flex flex-row ml-4 flex-1">
                    <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm w-full">
                        {/* Champion & Items */}
                        <div className="col-span-1 flex items-center gap-2">
                            <ChampionIcon championName={participant.championName} size={64} />
                            {runeInfo.hasRunes && (
                                <RuneDisplay
                                    primaryRuneUrl={runeInfo.primaryRuneUrl}
                                    runePathUrl={runeInfo.runePathUrl}
                                />
                            )}
                            <ItemDisplay
                                itemsIDs={participant.items}
                                gameMode={gameMode}
                                participant={participant}
                            />
                        </div>

                        {/* Match Stats - GameMode specific */}
                        <div className="col-span-1 flex flex-col justify-center gap-2">
                            <MatchStats participant={participant} gameMode={gameMode} />
                        </div>
                    </div>

                    {/* Participants List */}
                    <div className="ml-6 border-l border-gray-700 pl-4 w-1/2">
                        <ParticipantList
                            participants={match.participants}
                            gameMode={gameMode}
                            server={server}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}