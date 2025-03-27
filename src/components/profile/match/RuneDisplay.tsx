"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Rune } from "@/types/interfaces";
import { motion } from "framer-motion";
import { getRuneImageUrl } from "@/utils/getLeagueOfLegendsAssets/getGameVisuals/getRuneIcon";
import {cleanItemDescription} from "@/components/profile/match/ItemDisplay";

export function RuneDisplay({ runes }: { runes: Rune[] }) {
    const [primaryIconUrl, setPrimaryIconUrl] = useState<string | null>(null);
    const [secondaryIconUrl, setSecondaryIconUrl] = useState<string | null>(null);
    const [hoveredRune, setHoveredRune] = useState<Rune | null>(null);

    const primaryRune = runes?.[0];
    const secondaryRune = runes?.[runes.length - 1]; // full Rune object
    const secondaryPath = secondaryRune?.runePath;

    useEffect(() => {
        const loadIcons = async () => {
            if (primaryRune?.icon) {
                setPrimaryIconUrl(await getRuneImageUrl(primaryRune.icon));
            }
            if (secondaryPath?.icon) {
                setSecondaryIconUrl(await getRuneImageUrl(secondaryPath.icon));
            }
        };

        void loadIcons();
    }, [primaryRune?.icon, secondaryPath?.icon]);

    if (!primaryRune || !secondaryRune || !secondaryPath) return null;

    return (
        <div className="flex flex-col items-center bg-gray-800 rounded-sm p-1 border border-gray-600 gap-3">
            {/* Primary Rune */}
            {primaryIconUrl && (
                <div
                    className="relative"
                    onMouseEnter={() => setHoveredRune(primaryRune)}
                    onMouseLeave={() => setHoveredRune(null)}
                >
                    <Image
                        src={primaryIconUrl}
                        alt={primaryRune.name}
                        width={31}
                        height={31}
                        className="rounded-full cursor-pointer"
                    />
                    {hoveredRune === primaryRune && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 bottom-12 w-60 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-10 text-sm tracking-normal"
                        >
                            <div className="font-bold text-blue-400">{primaryRune.name}</div>
                            <div className="text-xs text-gray-300 mt-1">{cleanItemDescription(primaryRune.shortDesc)}</div>
                            <div className="mt-2 text-xs text-gray-400">{cleanItemDescription(primaryRune.longDesc)}</div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
                        </motion.div>
                    )}
                </div>
            )}

            {/* Secondary Rune Path */}
            {secondaryIconUrl && (
                <div
                    className="relative"
                    onMouseEnter={() => setHoveredRune(secondaryRune)}
                    onMouseLeave={() => setHoveredRune(null)}
                >
                    <Image
                        src={secondaryIconUrl}
                        alt={secondaryPath.name}
                        width={20}
                        height={20}
                        className="rounded-full cursor-pointer"
                    />
                    {hoveredRune === secondaryRune && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 bottom-12 w-48 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-10 text-sm tracking-normal"
                        >
                            <div className="font-bold text-blue-400">{secondaryPath.name}</div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
