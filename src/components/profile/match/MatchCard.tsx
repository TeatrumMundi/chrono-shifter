"use client";

import { useEffect, useState } from "react";
import { MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import { getRuneImageUrl } from "@/utils/leagueAssets";
import { queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helper";
import {
    ChampionIcon,
    ItemDisplay,
    RuneDisplay,
    MatchStats,
    ParticipantList,
} from "@/components/profile/match";

interface MatchCardProps {
    participant: ProcessedParticipant;
    match: MatchResponse;
    server: string;
}

/**
 * MatchCard component displays a summary of a single match,
 * including champion, items, runes, stats, and participants.
 */
export function MatchCard({ participant, match, server }: MatchCardProps) {
    const [runeInfo, setRuneInfo] = useState({
        primaryRuneUrl: "",
        runePathUrl: "",
        hasRunes: false,
    });

    // Load rune icons (primary + secondary) if available
    useEffect(() => {
        const loadRuneInfo = async () => {
            if (!participant.runes?.length) {
                setRuneInfo({ primaryRuneUrl: "", runePathUrl: "", hasRunes: false });
                return;
            }

            const [firstRune] = participant.runes;
            const lastRune = participant.runes.at(-1);

            try {
                const primaryUrl = firstRune?.icon
                    ? await getRuneImageUrl(firstRune.icon)
                    : "";
                const pathUrl = lastRune?.runePath?.icon
                    ? await getRuneImageUrl(lastRune.runePath.icon)
                    : "";

                setRuneInfo({
                    primaryRuneUrl: primaryUrl,
                    runePathUrl: pathUrl,
                    hasRunes: true,
                });
            } catch (error) {
                console.error("Error loading rune images:", error);
            }
        };

        void loadRuneInfo();
    }, [participant.runes]);

    const gameMode : string = queueIdToGameMode[match.queueId] || "Unknown";
    const winText = participant.win ? "Win" : "Loss";
    const winTextColor = participant.win ? "text-green-500" : "text-red-500";
    const bgColor = participant.win ? "bg-green-900/90" : "bg-red-900/90";

    return (
        <div className="relative flex flex-col h-full">
            {/* Left vertical win/loss indicator bar */}
            <div
                className={`absolute left-0 top-0 h-full w-[12px] ${
                    participant.win ? "bg-green-400" : "bg-red-400"
                } rounded-l-xl`}
            />

            {/* Main Match Card */}
            <div
                className={`p-5 rounded-xl shadow-lg font-sans ${bgColor} ml-[4px] flex-1 overflow-visible`}
            >
                <div className="flex items-center h-full">
                    {/* Left Column: Match Summary */}
                    <div className="w-[15%] pr-2 border-r border-gray-500/50 flex flex-col items-center justify-center text-center h-full tracking-widest">
                        <div className="text-lg font-semibold text-gray-200">{gameMode}</div>
                        <div className="text-gray-400 text-xs mt-1">
                            {timeAgo(match.gameEndTimestamp)}
                        </div>
                        <div className={`mt-1 text-base font-medium ${winTextColor}`}>
                            {winText}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                            {secToHHMMSS(match.gameDuration)}
                        </div>
                    </div>

                    {/* Right Column: Match Content */}
                    <div className="flex flex-row ml-4 flex-1 h-full">
                        {/* Match Details */}
                        <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm w-full h-full">
                            {/* Champion & Items */}
                            <div className="col-span-1 flex items-center gap-2 h-full">
                                <ChampionIcon
                                    championName={participant.championName}
                                    size={64}
                                />

                                <ItemDisplay
                                    itemsIDs={participant.items}
                                    gameMode={gameMode}
                                    participant={participant}
                                />

                                {runeInfo.hasRunes && (
                                    <RuneDisplay
                                        primaryRuneUrl={runeInfo.primaryRuneUrl}
                                        runePathUrl={runeInfo.runePathUrl}
                                    />
                                )}
                            </div>

                            {/* Match Stats */}
                            <div className="col-span-1 flex flex-col justify-center gap-2 h-full">
                                <MatchStats participant={participant} gameMode={gameMode} />
                            </div>
                        </div>

                        {/* Participants List */}
                        <div className="ml-6 border-l border-gray-500/50 pl-4 w-1/2 h-full">
                            <ParticipantList
                                participants={match.participants}
                                gameMode={gameMode}
                                server={server}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
