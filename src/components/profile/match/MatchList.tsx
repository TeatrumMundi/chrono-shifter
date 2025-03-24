"use client";

import { FormatResponseReturn, MatchResponse, ProcessedParticipant } from "@/types/interfaces";
import { getParticipantByPuuid } from "@/utils/helper";
import { useMemo } from "react";
import { MatchCard } from "./MatchCard";

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
            <h3 className="mt-6 mb-4 rounded-xl p-1 text-lg font-semibold text-gray-200 bg-gray-800 tracking-[.25em]">
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
