"use client";

import { useEffect, useState } from "react";
import { queueIdToGameMode } from "@/utils/helper";

export function MatchHistoryHeader({onQueueChangeAction, onSearchAction,}: {
    onQueueChangeAction: (queue: string) => void;
    onSearchAction: (value: string) => void;
}) {
    const MAIN_QUEUES = new Set([
        "Ranked Solo/Duo",
        "Ranked Flex",
        "ARAM",
        "Arena",
        "Clash",
    ]);

    const extractQueueTypes = () => {
        const allQueues = Object.values(queueIdToGameMode);
        const mainQueues = Array.from(new Set(allQueues.filter((q) => MAIN_QUEUES.has(q))));
        const otherQueues = Array.from(new Set(allQueues.filter((q) => !MAIN_QUEUES.has(q))));
        return { mainQueues, otherQueues };
    };

    const [selectedQueue, setSelectedQueue] = useState("All Matches");
    const [searchTerm, setSearchTerm] = useState("");

    const { mainQueues, otherQueues } = extractQueueTypes();
    const allQueues = ["All Matches", ...mainQueues, ...otherQueues];

    // ✅ Debounce search for better performance
    useEffect(() => {
        const delay = setTimeout(() => {
            onSearchAction(searchTerm);
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTerm, onSearchAction]);

    const handleQueueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedQueue(value);
        onQueueChangeAction(value);
    };

    return (
        <div className="relative w-full flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-4 bg-gray-900 rounded-sm shadow-md text-white font-sans border border-gray-700/40">
            <div className="absolute left-0 top-0 h-full w-[12px] bg-blue-950 rounded-l-sm" />

            <h2 className="text-xl font-bold text-blue-300 pl-4 whitespace-nowrap">Matches:</h2>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 justify-end">
                {/* Queue Select */}
                <div className="relative w-full sm:w-64">
                    <select
                        value={selectedQueue}
                        onChange={handleQueueChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-sm px-3 py-[6px] text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        {allQueues.map((queue) => (
                            <option key={queue} value={queue}>
                                {queue}
                            </option>
                        ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                        ▼
                    </div>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search champion or teammate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-sm px-3 py-[6px] text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                />
            </div>
        </div>
    );
}
