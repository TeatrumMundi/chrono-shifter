"use client";
import Image from "next/image";
import { BannerProps } from "@/types/interfaces";
export function Banner({ data }: BannerProps) {
    const summonerIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${data.profileIconId}.jpg`;

    const rankedSoloIconUrl = `/rankedIcons/${data.soloTier.toLowerCase()}.png`;
    const rankedFlexIconUrl = `/rankedIcons/${data.flexTier.toLowerCase()}.png`;

    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-green-400" : "text-red-500";

    if (!summonerIconUrl) return <div>Loading summoner icon...</div>;

    return (
        <div className="flex flex-col lg:flex-row items-center bg-gray-900/70 rounded-lg shadow-lg p-6 w-full gap-6">
            <SummonerIcon url={summonerIconUrl} level={data.summonerLevel} />

            <div className="flex-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-center lg:text-left">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest leading-tight">
                        {data.gameName}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center lg:justify-start">
                        <h3 className="text-lg md:text-xl text-white/90 tracking-widest">
                            #{data.tagLine}
                        </h3>
                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow tracking-[.25em]">
                            Update
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center tracking-widest">
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
    );
}

function RankSection({ title, tier, rank, wins, losses, winRate, lp, iconUrl, getWinRateColor }: {
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
        <div className="flex items-center gap-4 text-white">
            <div className="hidden xl:block border-l-2 border-white/20 h-24" />
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold tracking-widest">{title}</span>
                <span className="text-2xl mt-1 tracking-widest">
                    {tier} {rank}
                </span>
                <div className="flex gap-1 text-lg tracking-widest mt-1">
                    <span className="text-green-400">{wins}W</span>
                    <span>:</span>
                    <span className="text-red-500">{losses}L</span>
                    <span>(<span className={getWinRateColor(winRate)}>{winRate}%</span>)</span>
                </div>
                <span className="text-sm mt-1">{lp} LP</span>
            </div>
            <RankIcon url={iconUrl} title={title} />
        </div>
    );
}

function SummonerIcon({ url, level }: { url: string; level: string }) {
    return (
        <div className="relative flex-shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
                <Image
                    src={url}
                    alt="Summoner Icon"
                    fill
                    className="rounded-lg border border-gray-500 object-cover"
                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
                    quality={20}
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
            className="hidden xl:block"
            quality={50}
            loading="lazy"
        />
    );
}
