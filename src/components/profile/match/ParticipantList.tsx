import { ProcessedParticipant } from "@/types/interfaces";
import { ArenaParticipantList } from "@/components/profile/arena/ArenaParticipantList";
import { ChampionIcon } from "@/components/profile/match/ChampionIcon";
import Link from "next/link";
import React, { useMemo } from "react";

/**
 * Renders a participant list based on the current game mode.
 */
export function ParticipantList({
                                    participants,
                                    gameMode,
                                    server,
                                }: {
    participants: ProcessedParticipant[];
    gameMode: string;
    server: string;
}) {
    if (gameMode === "Arena") {
        return (
            <ArenaParticipantList
                participants={participants}
                server={server}
            />
        );
    }

    return (
        <StandardParticipantList
            participants={participants}
            server={server}
        />
    );
}

/**
 * Classic 5v5 layout:
 * - Left column: one team
 * - Right column: opposing team
 */
function StandardParticipantList({
                                     participants,
                                     server,
                                 }: {
    participants: ProcessedParticipant[];
    server: string;
}) {
    const teams = useMemo(() => {
        const team100: ProcessedParticipant[] = [];
        const team200: ProcessedParticipant[] = [];

        participants.forEach((p) => {
            if (p.teamId === 100) team100.push(p);
            else if (p.teamId === 200) team200.push(p);
        });

        return {
            leftTeam: team100,
            rightTeam: team200,
        };
    }, [participants]);

    return (
        <div className="text-xs text-gray-400 tracking-normal w-full">
            <div className="flex flex-col gap-1 w-full">
                {Array.from({ length: 5 }).map((_, i) => {
                    const leftPlayer = teams.leftTeam[i];
                    const rightPlayer = teams.rightTeam[i];

                    return (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-1 sm:gap-2"
                        >
                            {/* Left Player */}
                            <div className="flex items-center justify-between bg-blue-900/80 p-1 rounded w-full sm:w-[49%] hover:bg-blue-900/60 transition-colors">
                                {leftPlayer && (
                                    <>
                                        <Link
                                            href={`/${server}/${leftPlayer.riotIdGameName}/${leftPlayer.riotIdTagline}`}
                                            className="text-xs hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                            title={`${leftPlayer.riotIdGameName}#${leftPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${leftPlayer.riotIdGameName}`}
                                        >
                                            {leftPlayer.riotIdGameName}
                                        </Link>
                                        <ChampionIcon
                                            championName={leftPlayer.championName}
                                            size={16}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Right Player */}
                            <div className="flex items-center justify-between gap-1 bg-violet-900/80 p-1 rounded w-full sm:w-[49%] hover:bg-violet-900/60 transition-colors">
                                {rightPlayer && (
                                    <>
                                        <ChampionIcon
                                            championName={rightPlayer.championName}
                                            size={16}
                                        />
                                        <Link
                                            href={`/${server}/${rightPlayer.riotIdGameName}/${rightPlayer.riotIdTagline}`}
                                            className="text-xs hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                            title={`${rightPlayer.riotIdGameName}#${rightPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${rightPlayer.riotIdGameName}`}
                                        >
                                            {rightPlayer.riotIdGameName}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}