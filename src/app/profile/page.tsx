import { Suspense } from 'react';
import { getSummonerProfile } from "@/utils/getSummonerProfile";
import { getParticipantByPuuid, secToHHMMSS, timeAgo } from "@/utils/helper";
import { Banner } from "@/app/profile/banner";
import { Background } from "@/app/profile/background";
import { MatchResponse, ProcessedParticipant, FormatResponseReturn } from '@/types/interfaces';
import Link from 'next/link';
import { SearchForm } from '@/components/search';

// Define strong types for the expected search parameters
type ProfileSearchParams = {
    server?: string;
    name?: string;
    tag?: string;
};

// Add loading and error components
function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 animate-pulse">
            <div className="h-40 bg-gray-700/50 rounded-lg mb-6 mt-16"></div>
            <div className="h-8 bg-gray-700/50 w-48 rounded mb-4"></div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700/50 rounded-lg mt-4"></div>
            ))}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="container mx-auto px-4 py-8 mt-8 md:mt-16 text-center">
            <div className="bg-red-900/70 rounded-lg p-4 md:p-8 shadow-lg mb-4 md:mb-8 max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-[.20em]">Error</h2>
                <p className="text-red-100 tracking-[.10em] font-sans">{message}</p>
            </div>

            {/* Use the existing Search component */}
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-12 tracking-[.25em] bg-white/10 px-4 py-2 rounded-lg inline-block">
                    Try searching for another summoner:
                </h3>

                <div className="w-full">
                    <SearchForm />
                </div>

                {/* Increased margin-top and styled link to look like a button */}
                <div className="mt-16 inline-block">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 tracking-[.25em]"
                    >
                        Return to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Data fetching function with proper error handling
async function fetchProfileData(params: ProfileSearchParams) {
    const { server, name, tag } = params;

    // Validate required parameters
    if (!server || !name || !tag) {
        return null;
    }

    try {
        return await getSummonerProfile(server, name, tag);
    } catch (error) {
        console.error("Failed to fetch summoner profile:", error);
        return null;
    }
}

// Component to render matches
function MatchList({ data, puuid }: { data: FormatResponseReturn; puuid: string }) {
    const mainPlayerMatches = data.match
        .map((match: MatchResponse) => getParticipantByPuuid(match, puuid))
        .filter((participant: ProcessedParticipant | null) => participant !== null) as ProcessedParticipant[];

    if (mainPlayerMatches.length === 0) {
        return (
            <div className="col-span-12 p-6 bg-gray-800/80 rounded-xl mt-4 text-gray-300 text-center">
                No match data found for this player.
            </div>
        );
    }

    return (
        <>
            <h3 className="mt-6 text-lg font-semibold border-b border-gray-700 pb-2 text-gray-200">Recent Matches</h3>
            <div className="grid grid-cols-1 gap-4 tracking-[.25em]">
                {mainPlayerMatches.map((participant: ProcessedParticipant, index: number) => (
                    <div
                        key={index}
                        className="p-5 bg-gray-800/80 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-semibold text-gray-200">
                                Match {index + 1}: {participant.riotIdGameName}
                            </h4>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    participant.win ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                }`}
                            >
                                {participant.win ? "Win" : "Loss"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-gray-400 text-sm">
                            <p>
                                <span className="font-semibold text-gray-300">Champion:</span> {participant.championName}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">KDA:</span> {participant.kills}/
                                {participant.deaths}/{participant.assists} ({participant.kda})
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Game Mode:</span> {data.match[index].gameMode}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Role:</span> {participant.teamPosition}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Duration:</span>{" "}
                                {secToHHMMSS(data.match[index].gameDuration)}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Played:</span>{" "}
                                {timeAgo(data.match[index].gameEndTimestamp)}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Damage:</span> {participant.damageDealt}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Gold Earned:</span> {participant.goldEarned}
                            </p>
                            <p className="col-span-2">
                                <span className="font-semibold text-gray-300">Runes:</span> {participant.runes.join(", ")}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Vision Score:</span> {participant.visionScore}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-300">Minions:</span> {participant.minionsKilled} (
                                {participant.minionsPerMinute})
                            </p>
                        </div>

                        <div className="mt-4 border-t border-gray-700 pt-3 text-sm text-gray-400">
                            <p className="font-semibold text-gray-300">Participants:</p>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <p key={i}>
                                        {data.match[index].participants[i].riotIdGameName} vs{" "}
                                        {data.match[index].participants[i + 5].riotIdGameName}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


// Main Profile Component with Content
function ProfileContent({ searchParams }: { searchParams: ProfileSearchParams }) {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <ProfileData searchParams={searchParams} />
        </Suspense>
    );
}

// Async component that handles data fetching
async function ProfileData({ searchParams }: { searchParams: Promise<ProfileSearchParams> | ProfileSearchParams }) {
    const resolvedParams = await searchParams; // Ensure we await searchParams
    const { server, name, tag } = resolvedParams;

    if (!server || !name || !tag) {
        return (
            <div className="container mx-auto px-4 mt-16 text-center">
                <div className="bg-yellow-900/70 rounded-lg p-8 shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Missing Information</h2>
                    <p className="text-yellow-100">Please provide a summoner name, tag, and server to search.</p>
                </div>

                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-4">Search for a summoner:</h3>
                    <SearchForm />

                    <div className="text-center mt-4">
                        <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
                            Return to Home Page
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const data = await fetchProfileData(resolvedParams);

    if (!data) {
        return <ErrorState message="Could not retrieve summoner data. Please check if the summoner exists and try again." />;
    }

    return (
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-12 gap-4 mt-16">
                <div className="col-span-12">
                    <Banner data={data} />
                    <MatchList data={data} puuid={data.puuid} />
                </div>
            </div>
        </div>
    );
}


// Page Component with metadata
export default function ProfilePage({searchParams,}: { searchParams: ProfileSearchParams; }) {
    return (
        <div className="relative">
            <Background />
            <ProfileContent searchParams={searchParams} />
        </div>
    );
}

// Generate metadata for the page - fixed to use async searchParams correctly
export async function generateMetadata({ searchParams }: {
    searchParams: Promise<ProfileSearchParams> | ProfileSearchParams
}) {
    // Ensure searchParams is awaited
    const resolvedParams = await searchParams;
    const { server, name, tag } = resolvedParams;

    if (!name || !tag) {
        return {
            title: 'Profile Not Found - ChronoShifter',
            description: 'Summoner profile could not be found',
        };
    }

    return {
        title: `${name}#${tag} - ${server} - ChronoShifter`,
        description: `View ${name}#${tag}'s League of Legends profile stats and match history on the ${server} server`,
    };
}
