import React, { useMemo } from 'react';
import Link from 'next/link';
import {ProcessedParticipant} from "@/types/interfaces";
import {ChampionIcon} from "@/components/profile/match";

const TEAM_COLORS: string[] = [
    'bg-yellow-800/60',
    'bg-cyan-800/60',
    'bg-blue-800/60',
    'bg-purple-800/60',
    'bg-orange-800/60',
    'bg-pink-800/60',
    'bg-teal-800/60',
    'bg-indigo-800/60'
];

export function ArenaParticipantList({participants, server}: {
    participants: ProcessedParticipant[];
    server: string;
}) {
    const teams = useMemo(() => {
        const teamGroups: { [key: number]: ProcessedParticipant[] } = {};

        participants.forEach(participant => {
            const teamId = participant.arenaData?.playerSubteamId ?? -1;
            if (!teamGroups[teamId]) {
                teamGroups[teamId] = [];
            }
            teamGroups[teamId].push(participant);
        });

        return teamGroups;
    }, [participants]);

    const sortedTeamIds = useMemo(() =>
            Object.keys(teams).map(Number).sort(),
        [teams]
    );

    return (
        <div className="text-sm text-gray-400 tracking-normal">
            <div className="grid grid-cols-2 gap-2">
                {sortedTeamIds.map((teamId, index) => (
                    <div
                        key={teamId}
                        className={`flex p-1 rounded ${TEAM_COLORS[index % TEAM_COLORS.length]} transition-all duration-200 hover:opacity-80 overflow-hidden`}
                    >
                        {teams[teamId].map((player, playerIndex) => (
                            <div key={playerIndex} className="flex items-center gap-1 mr-2 flex-shrink-0">
                                <ChampionIcon championName={player.championName} size={16} />
                                <Link
                                    href={`/${server}/${player.riotIdGameName}/${player.riotIdTagline}`}
                                    className="text-sm w-[80px] truncate hover:text-blue-400 transition-colors"
                                    title={player.riotIdGameName}
                                >
                                    {player.riotIdGameName}
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}