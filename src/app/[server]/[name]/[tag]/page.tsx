import { Suspense, cache } from "react";
import { Banner, ErrorState } from "@/components/profile";
import { Metadata } from "next";
import { Background } from "@/components/common";
import {getChampionSplashUrl} from "@/utils/getLeagueOfLegendsAssets/getChampionSplash";
import {MatchList} from "@/components/profile/match";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

// Cache function for Background URL
cache(async (championId: number) => {
    return await getChampionSplashUrl(championId);
});

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
    const { getSummonerProfile } = await import("@/utils/getSummonerProfile");
    const resolvedParams = await params;
    const { server, name, tag } = resolvedParams;

    try {
        const profileData = await getSummonerProfile(server, name, tag);

        if (!profileData) {
            return <ErrorState message="Could not retrieve summoner data. Please check if the summoner exists and try again." />;
        }

        const championId : number = profileData.championMasteries[0]?.championId;

        return (
            <>
                <Background championId={championId} />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-12 gap-4 mt-16">
                        <div className="col-span-12">
                            <Banner data={profileData} />
                            <MatchList data={profileData} puuid={profileData.puuid} />
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
