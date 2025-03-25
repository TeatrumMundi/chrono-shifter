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
import { AugmentDisplay } from "@/components/profile/arena/AugmentDisplay";

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
            <div
                className={`absolute left-0 top-0 h-full w-[12px] ${
                    participant.win ? "bg-green-400" : "bg-red-400"
                } rounded-l-xl`}
            />

            {/* Main Card */}
            <div
                className={`p-5 rounded-xl shadow-lg font-sans ${bgColor} ml-[4px] flex-1 overflow-visible`}
            >
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {/* Summary Column */}
                    <div
                        className="flex flex-row flex-nowrap sm:flex-col items-center justify-center text-left sm:text-center tracking-wider
             border-b sm:border-b-0 sm:border-r border-gray-500/50
             pb-2 sm:pb-0 sm:pr-2
             w-full sm:w-auto sm:flex-none sm:basis-[120px] sm:min-w-[100px] sm:max-w-[140px]
             space-x-2 sm:space-x-0 sm:space-y-1"
                    >
                        <div className="whitespace-nowrap sm:whitespace-normal text-base sm:text-lg font-semibold text-gray-200">
                            {gameMode}
                        </div>
                        <div className="whitespace-nowrap sm:whitespace-normal text-xs sm:text-sm font-semibold text-gray-300">
                            {formatRole(participant.teamPosition)}
                        </div>
                        <div className="whitespace-nowrap sm:whitespace-normal text-[10px] sm:text-xs text-gray-400">
                            {timeAgo(match.gameEndTimestamp)}
                        </div>
                        <div className={`whitespace-nowrap sm:whitespace-normal text-sm sm:text-base font-medium ${winTextColor}`}>
                            {winText}
                        </div>
                        <div className="whitespace-nowrap sm:whitespace-normal text-[10px] sm:text-xs text-gray-400">
                            {secToHHMMSS(match.gameDuration)}
                        </div>
                    </div>


                    {/* Main Content + Participant List */}
                    <div className="flex flex-col lg:flex-row flex-1 min-w-0 gap-4">
                        {/* Left: Champion + Items + Runes + Augments + Stats */}
                        <div className="flex flex-col gap-4 flex-1 sm:flex-row">
                            {/* Champion + Items + Runes + Augments */}
                            <div className="flex flex-row sm:flex-col xl:flex-row items-center gap-1 min-w-[200px] max-w-[300px] w-full">
                                {/* Champion Icon + Runes */}
                                <div className="flex items-center gap-1">
                                    <ChampionIcon championName={participant.championName} size={72} />
                                    {runeInfo.hasRunes && (
                                        <div className="flex-shrink-0 w-[40px] min-w-[40px]">
                                            <RuneDisplay
                                                primaryRuneUrl={runeInfo.primaryRuneUrl}
                                                runePathUrl={runeInfo.runePathUrl}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Items and Augments */}
                                <div className="flex flex-row sm:flex-col 2xl:flex-row items-center gap-3 justify-center">
                                    <ItemDisplay itemsIDs={participant.items} />
                                    {gameMode === "Arena" &&
                                        participant.arenaData &&
                                        participant.arenaData.playerAugments.length > 0 && (
                                            <div className="w-full 2xl:w-auto">
                                                <AugmentDisplay augments={participant.arenaData.playerAugments} />
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col justify-center w-full min-w-0">
                                <MatchStats participant={participant} gameMode={gameMode} />
                            </div>
                        </div>

                        {/* Right: Participants */}
                        <div className="flex-1 w-full min-w-0 max-w-full sm:min-w-[280px] lg:w-[360px] lg:max-w-[380px] border-t lg:border-t-0 lg:border-l border-gray-500/50 pt-4 lg:pt-0 lg:pl-4">
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