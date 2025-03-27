"use client";

import { useState } from "react";
import Image from "next/image";
import { Champion } from "@/types/interfaces";
import { getChampionIconUrl } from "@/utils/getLeagueOfLegendsAssets/getGameVisuals/getChampionIcon";
import { motion } from "framer-motion";

export function ChampionIcon({ champion, size }: { champion: Champion; size: number }) {
    const [error, setError] = useState(false);
    const [hovered, setHovered] = useState(false);

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
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={getChampionIconUrl(champion)}
                alt={champion.name}
                width={size}
                height={size}
                className="rounded-sm border border-gray-600"
                onError={() => setError(true)}
                quality={30}
            />

            {hovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-12 w-48 p-2 bg-gray-900 text-white rounded-md shadow-lg z-10 text-sm tracking-tight"
                >
                    <div className="font-bold text-blue-400 text-center">{champion.name}</div>
                    <div className="mt-1 text-xs text-gray-300 text-center">
                        {champion.roles.join(" • ")}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
                </motion.div>
            )}
        </div>
    );
}
