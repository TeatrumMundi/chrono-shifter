import { Suspense } from 'react';
import { MatchList, Banner, ErrorState } from "@/components/profile";
import { Metadata } from 'next';
import { getChampionSplashUrl } from "@/utils/leagueAssets";
import { Background } from "@/components/common";

function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
            {/* Progress Bar Animation */}
            <div className="w-200 h-4 bg-gray-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
            </div>
        </div>
    );
}

// Main Profile Component
export default function ProfilePage({ params }: { params: Promise<{ server: string; name: string; tag: string }> }) {
    return (
        <div className="relative">
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent params={params} />
            </Suspense>
        </div>
    );
}

async function ProfileContent({ params }: { params: Promise<{ server: string; name: string; tag: string }> }) {
    const { getSummonerProfile } = await import("@/utils/getSummonerProfile"); // Dynamic import
    const resolvedParams = await params; // Await the params promise
    const { server, name, tag } = resolvedParams;

    try {
        const data = await getSummonerProfile(server, name, tag);

        if (!data) {
            return <ErrorState message="Could not retrieve summoner data. Please check if the summoner exists and try again." />;
        }

        return (
            <>
                <Background customUrl={await getChampionSplashUrl(data.championMasteries[0].championId)} />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-12 gap-4 mt-16">
                        <div className="col-span-12">
                            <Banner data={data} />
                            <MatchList data={data} puuid={data.puuid} />
                        </div>
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error("Error fetching summoner data:", error);
        return <ErrorState message="An error occurred while retrieving summoner data." />;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ server: string; name: string; tag: string }> }): Promise<Metadata> {
    const resolvedParams = await params; // Await the params promise
    const { server, name, tag } = resolvedParams;

    return {
        title: `ChronoShifter - ${name.toUpperCase()}#${tag.toUpperCase()}`,
        description: `View ${name.toUpperCase()}#${tag.toUpperCase()}'s League of Legends profile stats and match history on the ${server} server`,
    };
}