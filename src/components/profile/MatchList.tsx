"use client";

import { useMemo, useState } from "react";
import { MatchCard } from "./match/MatchCard";
import {getParticipantByPuuid, queueIdToGameMode} from "@/utils/helper";
import {
    FormatResponseReturn,
    MatchResponse,
    ProcessedParticipant,
} from "@/types/ProcessedInterfaces";
import { MatchHistoryHeader } from "@/components/profile/MatchHistoryHeader";

interface MatchListProps {
    data: FormatResponseReturn;
    puuid: string;
}

export function MatchList({ data, puuid }: MatchListProps) {
    const [queueFilter, setQueueFilter] = useState("All Matches");
    const [searchFilter, setSearchFilter] = useState("");

    // Pair each match with the main participant
    const allMatchesWithMainPlayer = useMemo(() => {
        return data.match
            .map((match) => {
                const participant = getParticipantByPuuid(match, puuid);
                return participant ? { match, participant } : null;
            })
            .filter(
                (entry): entry is { match: MatchResponse; participant: ProcessedParticipant } =>
                    !!entry
            );
    }, [data, puuid]);

    // Apply filters to match-participant pairs
    const filteredMatches = useMemo(() => {
        return allMatchesWithMainPlayer.filter(({ match, participant }) => {
            const gameModeName = queueIdToGameMode[match.queueId] || "Unknown";

            const queueMatch =
                queueFilter === "All Matches" ||
                gameModeName.toLowerCase() === queueFilter.toLowerCase();

            const searchMatch =
                searchFilter === "" ||
                participant.champion.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                match.participants.some((p) =>
                    `${p.riotIdGameName}#${p.riotIdTagline}`
                        .toLowerCase()
                        .includes(searchFilter.toLowerCase())
                );

            return queueMatch && searchMatch;
        });
    }, [allMatchesWithMainPlayer, queueFilter, searchFilter]);

    return (
        <div className="space-y-4">
            <MatchHistoryHeader
                onQueueChangeAction={(selectedQueueType: string) => setQueueFilter(selectedQueueType)}
                onSearchAction={(searchInput: string) => setSearchFilter(searchInput)}
            />

            {filteredMatches.length === 0 ? (
                <div className="p-6 bg-gray-800/80 rounded-xl text-gray-300 text-center tracking-[.25em]">
                    No match data found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 tracking-[.25em]">
                    {filteredMatches.map(({ match, participant }) => (
                        <MatchCard
                            key={match.gameEndTimestamp + participant.puuid}
                            participant={participant}
                            match={match}
                            server={participant.server}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}