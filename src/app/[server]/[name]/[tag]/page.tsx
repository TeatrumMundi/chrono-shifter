import { Suspense } from 'react';
import { Background, MatchList, Banner } from "@/components/profile";
import { SearchForm } from "@/components/search";
import Link from "next/link";
import { Metadata } from 'next';

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

// Main Profile Component
export default function ProfilePage({ params }: { params: Promise<{ server: string; name: string; tag: string }> }) {
    return (
        <div className="relative">
            <Background />
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileData params={params} />
            </Suspense>
        </div>
    );
}

// Async function for data fetching
async function ProfileData({ params }: { params: Promise<{ server: string; name: string; tag: string }> }) {
    const { getSummonerProfile } = await import("@/utils/getSummonerProfile"); // Dynamic import
    const resolvedParams = await params; // Await the params promise
    const { server, name, tag } = resolvedParams;

    try {
        const data = await getSummonerProfile(server, name, tag);

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
    } catch (error) {
        console.error("Error fetching summoner data:", error);
        return <ErrorState message="An error occurred while retrieving summoner data."/>;
    }
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="container mx-auto px-4 py-8 mt-8 md:mt-16 text-center">
            <div className="bg-red-900/70 rounded-lg p-4 md:p-8 shadow-lg mb-4 md:mb-8 max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-[.20em]">Error</h2>
                <p className="text-red-100 tracking-[.10em] font-sans">{message}</p>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-12 tracking-[.25em] bg-white/10 px-4 py-2 rounded-lg inline-block">
                    Try searching for another summoner:
                </h3>

                <div className="w-full">
                    <SearchForm />
                </div>

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

// Updated generateMetadata function
export async function generateMetadata({ params }: { params: Promise<{ server: string; name: string; tag: string }> }): Promise<Metadata> {
    const resolvedParams = await params; // Await the params promise
    const { server, name, tag } = resolvedParams;

    return {
        title: `ChronoShifter - ${name}#${tag}`,
        description: `View ${name}#${tag}'s League of Legends profile stats and match history on the ${server} server`,
    };
}