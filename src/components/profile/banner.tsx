"use client";
import Image from "next/image";
import { BannerProps } from "@/types/interfaces";

export function Banner({ data }: BannerProps) {
    const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";
    const summonerIconUrl = `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/profileicon/${data.profileIconId}.png`;

    const rankedSoloIconUrl = `/rankedIcons/${data.soloTier.toLowerCase()}.png`;
    const rankedFlexIconUrl = `/rankedIcons/${data.flexTier.toLowerCase()}.png`;

    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-green-400" : "text-red-500";

    if (!summonerIconUrl) return <div>Loading summoner icon...</div>;

    return (
        // Outer container: column on mobile/tablet, row on lg+ (>=1024px)
        <div className="flex flex-col lg:flex-row items-center bg-gray-900/70 rounded-lg shadow-lg p-6 w-full gap-6">
            {/* Summoner Icon */}
            <div className="relative flex-shrink-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
                    <Image
                        src={summonerIconUrl}
                        alt="Summoner Icon"
                        fill
                        className="rounded-lg border border-gray-500 object-cover"
                        sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
                        priority
                        quality={40}
                    />
                </div>
                <div className="absolute bottom-0 w-full bg-black/70 rounded-b-lg px-2 py-1 text-xs text-white text-center shadow-md tracking-widest font-sans">
                    {data.summonerLevel}
                </div>
            </div>

            {/* Middle + Right sections */}
            <div className="flex-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Nick Section */}
                <div className="text-center lg:text-left">
                    {/* Smaller text on tablets: base => 2xl, md => 3xl, lg => 4xl */}
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

                {/* Ranked Section */}
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
        <div className="flex items-center gap-4 text-white">
            {/* Optional vertical divider for large screens */}
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
