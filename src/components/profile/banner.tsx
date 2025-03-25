"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BannerProps } from "@/types/interfaces";
import { getSummonerIconUrl } from "@/utils/leagueAssets";

export function Banner({ data }: BannerProps) {
    const [summonerIconUrl, setSummonerIconUrl] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const url = await getSummonerIconUrl(data.profileIconId);
                setSummonerIconUrl(url);
            } catch (error) {
                console.error("Failed to fetch summoner icon URL:", error);
            }
        })();
    }, [data.profileIconId]);

    const rankedSoloIconUrl = `/rankedIcons/${data.soloTier.toLowerCase()}.png`;
    const rankedFlexIconUrl = `/rankedIcons/${data.flexTier.toLowerCase()}.png`;

    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-green-400" : "text-red-500";

    if (!summonerIconUrl) return <div>Loading summoner icon...</div>;

    return (
        <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-6 items-center bg-gray-900/70 rounded-lg shadow-lg p-6 w-full">
            <div className="relative">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
                    <Image
                        src={summonerIconUrl}
                        alt="Summoner Icon"
                        fill
                        className="rounded-lg border border-gray-500 object-cover"
                        sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
                        priority={true}
                        quality={40}
                    />
                </div>
                <div className="absolute bottom-0 w-full bg-black/70 rounded-b-lg px-2 py-1 text-xs text-white text-center shadow-md tracking-widest font-sans">
                    {data.summonerLevel}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 md:gap-6">
                <div className="text-center md:text-left w-full">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide leading-tight">
                        {data.gameName}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center md:justify-start">
                        <h3 className="text-lg md:text-xl text-white/70">#{data.tagLine}</h3>
                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow">
                            Update
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-stretch gap-6 w-full tracking-widest">
                    <div className="flex-1 min-w-[250px] md:max-w-[300px]">
                        <RankSection
                            title="Solo Queue"
                            tier={data.soloTier}
                            rank={data.soloRank}
                            wins={data.soloWins}
                            losses={data.soloLosses}
                            winRate={data.soloWR}
                            lp={data.soloLP}
                            iconUrl={rankedSoloIconUrl}
                            getWinRateColor={getWinRateColor}
                        />
                    </div>

                    <div className="flex-1 min-w-[250px] md:max-w-[300px]">
                        <RankSection
                            title="Flex Queue"
                            tier={data.flexTier}
                            rank={data.flexRank}
                            wins={data.flexWins}
                            losses={data.flexLosses}
                            winRate={data.flexWR}
                            lp={data.flexLP}
                            iconUrl={rankedFlexIconUrl}
                            getWinRateColor={getWinRateColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RankSection({
                         title,
                         tier,
                         rank,
                         wins,
                         losses,
                         winRate,
                         lp,
                         iconUrl,
                         getWinRateColor,
                     }: {
    title: string;
    tier: string;
    rank: string;
    wins: number;
    losses: number;
    winRate: number;
    lp: number;
    iconUrl: string;
    getWinRateColor: (wr: number) => string;
}) {
    return (
        <div className="flex items-center gap-4 text-white w-full justify-center">
            <div className="hidden xl:block border-l-2 border-white/20 h-24" />
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold tracking-widerst">{title}</span>
                <span className="text-2xl mt-1 tracking-widest">
                    {tier} {rank}
                </span>
                <div className="flex gap-1 text-lg tracking-widest mt-1">
                    <span className="text-green-400">{wins}W</span>
                    <span>:</span>
                    <span className="text-red-500">{losses}L</span>
                    <span>
                        (<span className={getWinRateColor(winRate)}>{winRate}%</span>)
                    </span>
                </div>
                <span className="text-sm mt-1">{lp} LP</span>
            </div>
            <Image
                src={iconUrl}
                alt={`${title} Icon`}
                width={110}
                height={110}
                className="hidden xl:block"
                priority
            />
        </div>
    );
}