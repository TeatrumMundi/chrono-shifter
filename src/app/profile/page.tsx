import { Suspense } from 'react';
import { getSummonerProfile } from "@/utils/getSummonerProfile";
import { getParticipantByPuuid, secToHHMMSS, timeAgo } from "@/utils/helper";
import { Banner } from "@/app/profile/banner";
import { Background } from "@/app/profile/background";
import { notFound } from 'next/navigation';
import { MatchResponse, ProcessedParticipant, FormatResponseReturn } from '@/types/interfaces';

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
        <div className="container mx-auto px-4 mt-16 text-center">
            <div className="bg-red-900/70 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                <p className="text-red-100">{message}</p>
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
function MatchList({ data, puuid }: { data: FormatResponseReturn, puuid: string }) {
    const mainPlayerMatches = data.match
        .map((match: MatchResponse) => getParticipantByPuuid(match, puuid))
        .filter((participant: ProcessedParticipant | null) => participant !== null) as ProcessedParticipant[];

    if (mainPlayerMatches.length === 0) {
        return <div className="col-span-12 p-4 bg-gray-800/70 rounded-lg mt-4">No match data found for this player.</div>;
    }

    return (
        <>
            <h3 className="mt-6 border-b border-gray-700 pb-2 font-sans">Recent Matches:</h3>
            {mainPlayerMatches.map((participant: ProcessedParticipant, index: number) => (
                <div key={index} className="col-span-12 p-4 bg-gray-800/70 rounded-lg shadow-md mt-4 font-sans">
                    <h4>Match {index + 1}: {participant.riotIdGameName} ({participant.win ? "Win" : "Loss"})</h4>
                    <h4>Champion: {participant.championName} KDA: {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})</h4>
                    <h4>Game Mode: {data.match[index].gameMode}</h4>
                    <h4>Role: {participant.teamPosition}</h4>
                    <h4>Time: {secToHHMMSS(data.match[index].gameDuration)}</h4>
                    <h4>Match played: {timeAgo(data.match[index].gameEndTimestamp)}</h4>
                    <h4>Damage: {participant.damageDealt}</h4>
                    <h4>Gold: {participant.goldEarned}</h4>
                    <h4>Runes: {participant.runes.join(", ")}</h4>
                    <h4>Vision score: {participant.visionScore}</h4>
                    <h4>Minions: {participant.minionsKilled}, {participant.minionsPerMinute}</h4>
                    {[...Array(5)].map((_, i) => (
                        <h4 key={i}>{data.match[index].participants[i].riotIdGameName} vs {data.match[index].participants[i + 5].riotIdGameName}</h4>
                    ))}
                </div>
            ))}
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
        notFound();
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