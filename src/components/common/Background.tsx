"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getChampionSplashUrl } from "@/utils/getLeagueOfLegendsAssets/getChampionSplash";

interface BackgroundProps {
    championId?: number;
}

// In-memory cache for champion splash URLs
const splashCache = new Map<number, string>();

// Fallback: generate a random image URL from local assets
function getRandomImage(maxNumber: number): string {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    return `/main/${randomNumber}.jpg`;
}

export function Background({ championId }: BackgroundProps) {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (championId) {
                // If a champion ID is provided, try to fetch its splash URL
                if (splashCache.has(championId)) {
                    const cached = splashCache.get(championId)!;
                    if (isMounted) setBackgroundImageUrl(cached);
                } else {
                    try {
                        const url = await getChampionSplashUrl(championId);
                        if (url !== null) {
                            splashCache.set(championId, url);
                            if (isMounted) setBackgroundImageUrl(url);
                        }
                    } catch (err) {
                        console.error("Failed to fetch champion splash:", err);
                    }
                }
            } else {
                // No champion ID provided, so use a fallback random image
                const fallbackUrl = getRandomImage(12);
                if (isMounted) setBackgroundImageUrl(fallbackUrl);
            }
        };

        void fetchImage(); // Explicitly ignore the returned promise

        return () => {
            isMounted = false;
        };
    }, [championId]);

    // Don't render until we have a valid URL
    if (!backgroundImageUrl) return null;

    return (
        <div className="fixed inset-0 min-h-screen -z-10">
            <Image
                src={backgroundImageUrl}
                alt="Background"
                fill
                priority
                quality={100}
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>
        </div>
    );
}
