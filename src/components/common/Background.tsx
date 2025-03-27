"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getChampionSplashUrl } from "@/utils/getLeagueOfLegendsAssets/getGameVisuals/getChampionSplash";

interface BackgroundProps {
    championId?: number;
}

const splashCache = new Map<number, string>();

function getRandomImage(maxNumber: number): string {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    return `/main/${randomNumber}.jpg`;
}

export function Background({ championId }: BackgroundProps) {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
        () => championId ? splashCache.get(championId) || "" : getRandomImage(12)
    );
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            if (championId) {
                if (splashCache.has(championId)) {
                    if (isMounted) {
                        setBackgroundImageUrl(splashCache.get(championId)!);
                        setIsLoaded(true);
                    }
                } else {
                    try {
                        const url = await getChampionSplashUrl(championId);
                        if (url && isMounted) {
                            splashCache.set(championId, url);
                            setBackgroundImageUrl(url);
                            setIsLoaded(true);
                        }
                    } catch (err) {
                        console.error("Failed to fetch champion splash:", err);
                        if (isMounted) {
                            setBackgroundImageUrl(getRandomImage(12));
                            setIsLoaded(true);
                        }
                    }
                }
            } else {
                if (isMounted) {
                    setBackgroundImageUrl(getRandomImage(12));
                    setIsLoaded(true);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [championId]);

    return (
        <div className="fixed inset-0 min-h-screen -z-10 bg-gray-900">
            {backgroundImageUrl && (
                <Image
                    src={backgroundImageUrl}
                    alt="Background"
                    fill
                    quality={75}
                    className={`object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    priority={!!championId && championId < 10}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>
        </div>
    );
}
