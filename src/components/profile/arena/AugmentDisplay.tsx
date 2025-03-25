"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAugmentImageUrl } from "@/utils/leagueAssets";
import { BoxPlaceHolder } from "@/components/common";
import { Augment } from "@/types/interfaces";
import { motion } from "framer-motion";

// Rarity colors mapping for text and background
const rarityColors = ["text-slate-400", "text-yellow-400", "text-fuchsia-500"]; // Text colors
const rarityBgColors = [
    "bg-slate-400/30", // Silver with 20% opacity
    "bg-yellow-400/30", // Gold with 20% opacity
    "bg-fuchsia-500/30", // Prismatic with 20% opacity
];
const rarityNames = ["Silver", "Gold", "Prismatic"];

// Function to clean up raw HTML-like text
const cleanText = (text: string) => {
    return text
        .replace(/<\/?spellName>/g, "") // Remove <spellName> tags
        .replace(/<\/?rules>/g, "") // Remove <rules> tags
        .replace(/<br>/g, "\n") // Convert <br> to new lines
        .replace(/@f\d@/g, "X") // Replace placeholders like @f1@, @f2@ with "X"
        .replace(/<[^>]*>/g, ""); // Remove everything between < and >
};

// Arena-specific augment display
export function AugmentDisplay({ augments }: { augments: Augment[] }) {
    const [augmentUrls, setAugmentUrls] = useState<string[]>([]);
    const [hoveredAugment, setHoveredAugment] = useState<Augment | null>(null);

    useEffect(() => {
        if (!augments?.length) return;

        const fetchAugmentUrls = async () => {
            try {
                const urls = await Promise.all(
                    augments.map(async (augment) => {
                        try {
                            return await getAugmentImageUrl(augment.iconSmall);
                        } catch (error) {
                            console.error("Failed to fetch augment icon:", error);
                            return "";
                        }
                    })
                );
                setAugmentUrls(urls);
            } catch (error) {
                console.error("Error fetching augment URLs:", error);
            }
        };

        void fetchAugmentUrls();
    }, [augments]);

    if (!augmentUrls.length) return null;

    return (
        <div className="relative flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={`augment-row-${startIdx}`} className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const augmentIndex = startIdx + index;
                        const augment = augments[augmentIndex];
                        const url = augmentUrls[augmentIndex];

                        return augment ? (
                            <div
                                key={`augment-${augmentIndex}`}
                                className="relative"
                                onMouseEnter={() => setHoveredAugment(augment)}
                                onMouseLeave={() => setHoveredAugment(null)}
                            >
                                {/* Augment Icon with Transparent Background */}
                                <div className={`rounded-md ${rarityBgColors[augment.rarity]}`}>
                                    <Image
                                        src={url}
                                        alt={augment.name}
                                        width={32}
                                        height={32}
                                        className="rounded-md cursor-pointer"
                                    />
                                </div>

                                {/* Tooltip Popup */}
                                {hoveredAugment === augment && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            scale: 0.5,
                                            y: -20,
                                            transformOrigin: "bottom center"
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,  // Full scale so the content displays fully
                                            y: 0
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.5,
                                            y: -10
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.175, 0.885, 0.32, 1.275]
                                        }}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-12 w-60 p-2 bg-gray-900 text-white rounded-lg shadow-lg z-10 text-sm tracking-normal"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">{augment.name}</span>
                                            <span className={`font-bold ${rarityColors[augment.rarity]}`}>{rarityNames[augment.rarity]}</span>
                                        </div>
                                        <p className="text-gray-200 text-xs whitespace-normal break-words">
                                            {cleanText(augment.desc)}
                                        </p>

                                        {/* Arrow pointing to the hovered element */}
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <BoxPlaceHolder key={`augment-placeholder-${augmentIndex}`} />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}