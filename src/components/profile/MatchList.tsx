"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MatchCard } from "./match/MatchCard";
import { getParticipantByPuuid, queueIdToGameMode } from "@/utils/helper";
import { MatchResponse, ProcessedParticipant } from "@/types/ProcessedInterfaces";
import { MatchHistoryHeader } from "@/components/profile/MatchHistoryHeader";

interface MatchListProps {
    puuid: string;
    server: string;
}

// Config
const INITIAL_BATCH = 3;
const MATCHES_PER_PAGE = 3;

export function MatchList({ puuid, server }: MatchListProps) {
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [queueFilter, setQueueFilter] = useState("All Matches");
    const [searchFilter, setSearchFilter] = useState("");

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchMatches = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const limit = offset === 0 ? INITIAL_BATCH : MATCHES_PER_PAGE;
            const res = await fetch(`/api/matches?puuid=${puuid}&offset=${offset}&limit=${limit}`);
            const newMatches: MatchResponse[] = await res.json();

            setMatches((prev) => {
                const seen = new Set(prev.map((m) => m.matchId));
                const uniqueNew = newMatches.filter((m) => !seen.has(m.matchId));
                return [...prev, ...uniqueNew];
            });

            if (newMatches.length < limit) {
                setHasMore(false);
            }

            setOffset((prev) => prev + newMatches.length);
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, puuid, offset]);

    // Fetch first batch
    useEffect(() => {
        void (async () => {
            await fetchMatches();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // IntersectionObserver to trigger fetch when ref is in view
    useEffect(() => {
        if (!loadMoreRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !loading) {
                    void fetchMatches();
                }
            },
            {
                rootMargin: "0px 0px 200px 0px",
            }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, [fetchMatches, hasMore, loading]);

    const filtered = matches
        .map((match) => {
            const participant = getParticipantByPuuid(match, puuid);
            return participant ? { match, participant } : null;
        })
        .filter((entry): entry is { match: MatchResponse; participant: ProcessedParticipant } => !!entry)
        .filter(({ match, participant }) => {
            const mode = queueIdToGameMode[match.queueId] || "Unknown";

            const queueOk =
                queueFilter === "All Matches" ||
                mode.toLowerCase() === queueFilter.toLowerCase();

            const searchOk =
                searchFilter === "" ||
                participant.champion.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                match.participants.some((p) =>
                    `${p.riotIdGameName}#${p.riotIdTagline}`.toLowerCase().includes(searchFilter.toLowerCase())
                );

            return queueOk && searchOk;
        });

    return (
        <div className="space-y-4">
            <MatchHistoryHeader
                onQueueChangeAction={(queue) => setQueueFilter(queue)}
                onSearchAction={(value) => setSearchFilter(value)}
            />

            {filtered.length === 0 ? (
                <div className="p-6 bg-gray-800/80 rounded-xl text-gray-300 text-center tracking-[.25em]">
                    No match data found.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 tracking-[.25em]">
                        {filtered.map(({ match, participant }) => (
                            <MatchCard
                                key={match.matchId}
                                participant={participant}
                                match={match}
                                server={server}
                            />
                        ))}
                    </div>

                    {/* Trigger load when visible */}
                    {hasMore && <div ref={loadMoreRef} className="h-10" />}

                    {loading && (
                        <div className="text-center text-gray-400 py-4 text-sm tracking-widest">
                            Loading more matches...
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
