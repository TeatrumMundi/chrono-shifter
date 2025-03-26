"use client"

import {useState} from "react";
import Image from "next/image";
import {getChampionIcon} from "@/utils/leagueAssets";

export function ChampionIcon({championID, size}: { championID: number; size: number }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                style={{ width: size, height: size }}
                className="bg-gray-900 rounded-sm border border-gray-600 flex items-center justify-center text-gray-400"
            >
                ?
            </div>
        );
    }

    return (
        <Image
            src={getChampionIcon(championID)}
            alt={championID.toString()}
            width={size}
            height={size}
            className="rounded-sm border border-gray-600"
            onError={() => setError(true)}
            quality={50}
        />
    );
}