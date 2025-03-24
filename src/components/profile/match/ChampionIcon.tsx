"use client"

import {useState} from "react";
import Image from "next/image";
import {getChampionIcon} from "@/utils/leagueAssets";

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