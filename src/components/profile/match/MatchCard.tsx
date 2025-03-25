"use client";

import { useEffect, useState } from "react";
import { MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import { getRuneImageUrl } from "@/utils/leagueAssets";
import {
    formatRole,
    queueIdToGameMode,
    secToHHMMSS,
    timeAgo,
} from "@/utils/helper";
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

export function MatchCard({ participant, match, server }: MatchCardProps) {
    const [runeInfo, setRuneInfo] = useState({
        primaryRuneUrl: "",
        runePathUrl: "",
        hasRunes: false,
    });

    useEffect(() => {
        const loadRuneInfo = async () => {
            if (!participant.runes?.length) {
                setRuneInfo({ primaryRuneUrl: "", runePathUrl: "", hasRunes: false });
                return;
            }

            const [firstRune] = participant.runes;
            const lastRune = participant.runes.at(-1);

            try {
                const primaryUrl = firstRune?.icon ? await getRuneImageUrl(firstRune.icon) : "";
                const pathUrl = lastRune?.runePath?.icon ? await getRuneImageUrl(lastRune.runePath.icon) : "";

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

    const gameMode = queueIdToGameMode[match.queueId] || "Unknown";
    const winText = participant.win ? "Win" : "Loss";
    const winTextColor = participant.win ? "text-green-500" : "text-red-500";
    const bgColor = participant.win ? "bg-green-900/90" : "bg-red-900/90";

    return (
        <div className="relative flex flex-col h-full w-full">
            {/* Vertical win/loss bar */}
            <div className={`absolute left-0 top-0 h-full w-[12px] ${participant.win ? "bg-green-400" : "bg-red-400"} rounded-l-xl`} />

            {/* Main Card */}
            <div className={`p-5 rounded-xl shadow-lg font-sans ${bgColor} ml-[4px] flex-1 overflow-visible`}>
                <div className="flex flex-wrap gap-4 w-full">
                    {/* Summary Column */}
                    <div
                        className="flex flex-col justify-center text-left sm:text-center tracking-wider
                        border-r border-gray-500/50 pr-2
                        flex-none basis-[100px] sm:basis-[120px] min-w-[100px] max-w-[140px]"
                    >
                        <div className="text-base sm:text-lg font-semibold text-gray-200">{gameMode}</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-300">{formatRole(participant.teamPosition)}</div>
                        <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{timeAgo(match.gameEndTimestamp)}</div>
                        <div className={`mt-1 text-sm sm:text-base font-medium ${winTextColor}`}>{winText}</div>
                        <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{secToHHMMSS(match.gameDuration)}</div>
                    </div>

                    {/* Main Content + Participant List */}
                    <div className="flex flex-wrap flex-col lg:flex-row flex-1 min-w-0 gap-4">
                        {/* Left: Champion + Items + Runes + Stats */}
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Champion + Items + Runes */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                                <ChampionIcon championName={participant.championName} size={64} />
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

                            {/* Stats */}
                            <div className="flex flex-col justify-center min-w-[200px]">
                                <MatchStats participant={participant} gameMode={gameMode} />
                            </div>
                        </div>

                        {/* Right: Participants */}
                        <div className="flex-1 w-full min-w-[280px] max-w-full lg:w-[360px] lg:max-w-[380px] border-t lg:border-t-0 lg:border-l border-gray-500/50 pt-4 lg:pt-0 lg:pl-4">
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