import { BannerProps } from "@/types/interfaces";
import Image from "next/image";
import {getSummonerIconUrl} from "@/utils/getSummonerIconUrl";

export function Banner({ data }: BannerProps) {
    const summonerIconUrl = getSummonerIconUrl("14.5.1", data.profileIconId);
    const rankedSoloIconUrl = `/rankedIcons/${data.soloTier}.png`;
    const rankedFlexIconUrl = `/rankedIcons/${data.flexTier}.png`;

    const getWinRateColor = (winRate: number) => {
        return winRate >= 50 ? "text-green-400" : "text-red-500";
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-4 items-center bg-gray-900/70 rounded-lg shadow-lg p-6">
            {/* Summoner Icon Container */}
            <div className="relative flex justify-center items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative">
                    <Image
                        src={summonerIconUrl}
                        alt="Summoner Icon"
                        fill
                        sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
                        className="rounded-lg border-gray-500 object-cover aspect-square"
                    />
                </div>
                <div className="absolute bottom-0 w-full bg-black/70 rounded-b-lg px-2 py-1 text-xs text-white text-center shadow-md tracking-[.25em]">
                    {data.summonerLevel}
                </div>
            </div>

            {/* Banner Content Container */}
            <div className="flex flex-col md:flex-row flex-grow items-center w-full justify-between">
                {/* Nickname and Tagline */}
                <div className="pr-6 text-white tracking-[.4em] text-center md:text-left w-full">
                    <h2 className="text-3xl md:text-[48px] font-bold leading-tight">
                        {data.gameName}
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                        <h3 className="text-lg md:text-[20px] opacity-50">
                            #{data.tagLine}
                        </h3>
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition transform duration-300 hover:scale-105 active:scale-95 shadow-lg">
                            Update
                        </button>
                    </div>
                </div>

                {/* Right Side: Flex and Solo Queue Data */}
                <div className="flex flex-col xl:flex-row items-center gap-6 mt-6 md:mt-0 w-full justify-center">
                    {/* Solo Queue Section */}
                    <div className="flex items-center gap-4">
                        <div className="border-l-2 border-white/20 h-24 hidden xl:block"></div>
                        {/* Divider */}

                        <div className="flex flex-col items-center xl:items-center">
                            <span className="text-xl font-semibold tracking-[.1em] text-center">Solo Queue</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl tracking-[.1em]">
                                    {data.soloTier} {data.soloRank}
                                </span>
                            </div>
                            <span className="text-lg tracking-[.1em] text-center">
                                {data.soloLP} LP <span className="text-green-400">{data.soloWins}W</span> : <span
                                className="text-red-500">{data.soloLosses}L</span> (<span
                                className={getWinRateColor(data.soloWR)}>{data.soloWR}%</span>)
                            </span>
                        </div>
                        <Image
                            src={rankedSoloIconUrl}
                            alt="Solo Queue Rank Icon"
                            width={110}
                            height={110}
                            className="hidden xl:block"
                        />
                    </div>

                    {/* Flex Queue Section */}
                    <div className="flex items-center gap-4">
                        <div className="border-l-2 border-white/20 h-24 hidden xl:block"></div>
                        {/* Divider */}

                        <div className="flex flex-col items-center xl:items-center">
                            <span className="text-xl font-semibold tracking-[.1em] text-center">Flex Queue</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl tracking-[.1em]">
                                    {data.flexTier} {data.flexRank}
                                </span>
                            </div>
                            <span className="text-lg tracking-[.1em] text-center">
                                {data.flexLP} LP <span className="text-green-400">{data.flexWins}W</span> : <span
                                className="text-red-500">{data.flexLosses}L</span> (<span
                                className={getWinRateColor(data.flexWR)}>{data.flexWR}%</span>)
                            </span>
                        </div>
                        <Image
                            src={rankedFlexIconUrl}
                            alt="Flex Queue Rank Icon"
                            width={110}
                            height={110}
                            className="hidden xl:block"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}