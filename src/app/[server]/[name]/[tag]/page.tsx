import { Suspense } from "react";
import { Banner, ErrorState } from "@/components/profile";
import { Metadata } from "next";
import { getChampionSplashUrl } from "@/utils/getLeagueOfLegendsAssets/getGameVisuals/getChampionSplash";
import { MatchList } from "@/components/profile/match";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { SpeedInsights } from "@vercel/speed-insights/next"


// Main Page Component
export default function ProfilePage({ params, }: { params: Promise<{ server: string; name: string; tag: string }>; }) {
    return (
        <div className="relative w-full overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent params={params} />
            </Suspense>
            <SpeedInsights/>
        </div>
    );
}

async function ProfileContent({params,}: { params: Promise<{ server: string; name: string; tag: string }>; }) {
    const { getSummonerProfile } = await import("@/utils/getSummonerProfile");
    const resolvedParams = await params;
    const { server, name, tag } = resolvedParams;

    try {
        const profileData = await getSummonerProfile(server, name, tag);

        if (!profileData) {
            return (
                <ErrorState message="Could not retrieve summoner data. Please check if the summoner exists and try again." />
            );
        }

        const splashUrl = await getChampionSplashUrl(profileData.championMasteries[0].championId);

        return (
            <div className="container mx-auto px-4 relative z-10 ">
                <div className="grid grid-cols-12 gap-4 mt-16">
                    <div className="col-span-12 space-y-8">
                        <Banner data={profileData} splashUrl={splashUrl}/>
                        <MatchList data={profileData} puuid={profileData.playerInfo.puuid} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching summoner data:", error);
        return (
            <ErrorState message="An error occurred while retrieving summoner data." />
        );
    }
}

export async function generateMetadata({params,}: { params: Promise<{ server: string; name: string; tag: string }>; }): Promise<Metadata> {
    const resolvedParams = await params;
    const { server, name, tag } = resolvedParams;

    return {
        title: `${name.toUpperCase()}#${tag.toUpperCase()} - ChronoShifter`,
        description: `View ${name.toUpperCase()}#${tag.toUpperCase()}'s League of Legends profile stats and match history on the ${server} server`,
    };
}
