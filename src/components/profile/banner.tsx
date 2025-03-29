"use client";

import Image from "next/image";
import { BannerProps } from "@/types/otherTypes";
import { RankedInfo } from "@/types/ProcessedInterfaces";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export function Banner({ data }: BannerProps) {
    const [isPending, startTransition] = useTransition();
    const [updated, setUpdated] = useState(false);
    const router = useRouter();

    const summonerIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${data.playerInfo.profileIconId}.jpg`;
    const rankedSoloIconUrl = `/rankedIcons/${data.soloRanked.Tier.toLowerCase()}.webp`;
    const rankedFlexIconUrl = `/rankedIcons/${data.flexRanked.Tier.toLowerCase()}.webp`;

    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-green-400" : "text-red-500";

    const handleUpdateClick = async () => {
        startTransition(async () => {
            const name = data.playerInfo?.gameName ?? "";
            const tag = data.playerInfo?.tagLine?.toLowerCase() ?? "";
            const server = data.playerInfo?.server ?? "";

            if (!name || !tag || !server) {
                console.warn("❌ Missing or invalid data", { name, tag, server });
                return;
            }

            try {
                const res = await fetch("/api/force-update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, tag, server }),
                });

                if (!res.ok)
                {
                    console.log(`❌ Update failed with status ${res.status}`);
                    return;
                }

                setUpdated(true);
                router.refresh();
            } catch (error) {
                console.error("Update error:", error);
            }
        });
    };

    return (
        <motion.div
            className="relative w-full overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative z-10 p-6 flex flex-col lg:flex-row items-center bg-gray-900/60 w-full gap-6">
                <SummonerIcon url={summonerIconUrl} level={data.playerInfo.summonerLevel.toString()} />

                <div className="flex-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest leading-tight">
                            {data.playerInfo.gameName}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center lg:justify-start">
                            <h3 className="text-lg md:text-xl text-white/90 tracking-widest">
                                #{data.playerInfo.tagLine}
                            </h3>
                            <button
                                onClick={handleUpdateClick}
                                className={`flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-lg text-sm md:text-base transition-all duration-300 shadow tracking-[.25em] ${
                                    isPending ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                                }`}
                                disabled={isPending}
                            >
                                <RotateCcw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
                                {updated ? "Updated" : isPending ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center tracking-widest">
                        <RankSection
                            title="Solo Queue"
                            ranked={data.soloRanked}
                            iconUrl={rankedSoloIconUrl}
                            getWinRateColor={getWinRateColor}
                        />
                        <RankSection
                            title="Flex Queue"
                            ranked={data.flexRanked}
                            iconUrl={rankedFlexIconUrl}
                            getWinRateColor={getWinRateColor}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function RankSection({title, ranked, iconUrl, getWinRateColor,}: { title: string; ranked: RankedInfo; iconUrl: string; getWinRateColor: (wr: number) => string; }) {
    return (
        <div className="flex items-center gap-4 text-white">
            <div className="border-l-2 border-white/20 h-24" />
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold tracking-widest">{title}</span>
                <span className="text-2xl mt-1 tracking-widest">
                    {ranked.Tier} {ranked.Rank}
                </span>
                <div className="flex gap-1 text-lg tracking-widest mt-1">
                    <span className="text-green-400">{ranked.Wins}W</span>
                    <span>:</span>
                    <span className="text-red-500">{ranked.Losses}L</span>
                    <span>
                        (
                        <span className={getWinRateColor(ranked.WR)}>{ranked.WR}%</span>
                        )
                    </span>
                </div>
                <span className="text-sm mt-1">{ranked.LP} LP</span>
            </div>
            <RankIcon url={iconUrl} title={title} />
        </div>
    );
}

function SummonerIcon({ url, level }: { url: string; level: string }) {
    return (
        <div className="relative flex-shrink-0">
            <div className="relative h-24 w-24">
                <Image
                    src={url}
                    alt="Summoner Icon"
                    fill
                    className="rounded-lg border border-gray-500 object-cover"
                    sizes="96px"
                    quality={50}
                    loading="eager"
                    priority
                />
            </div>
            <div className="absolute bottom-0 w-full bg-black/70 rounded-b-lg px-2 py-1 text-xs text-white text-center shadow-md tracking-widest font-sans">
                {level}
            </div>
        </div>
    );
}

function RankIcon({ url, title }: { url: string; title: string }) {
    return (
        <Image
            src={url}
            alt={`${title} Icon`}
            width={110}
            height={110}
            quality={50}
            loading="eager"
            sizes="110px"
            priority
        />
    );
}
