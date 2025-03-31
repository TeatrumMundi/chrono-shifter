import SearchForm from "@/components/search/SearchForm";

export const dynamic = "force-dynamic";

import { Banner } from "@/components/profile";
import { MatchList } from "@/components/profile/match";
import { getSummonerProfile } from "@/utils/getSummonerProfile";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type RouteParams = Promise<{ server: string; name: string; tag: string }>;

export default async function ProfilePage({ params }: { params: RouteParams }) {
    const { server, name, tag } = await params;

    const profileData = await getSummonerProfile(server, name, tag, 5);

    if (!profileData) {
        notFound();
    }

    return (
        <div className="relative w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 min-h-screen">
            {/* Navbar Container: Sticky, Z-index, Background, Full Width */}
            <div className="sticky top-0 z-50 bg-gradient-to-b from-purple-900 via-indigo-900 to-transparent shadow-md w-full">
                {/* Inner Content Container: Flex, Vertical Center, Space Between, Horizontal Padding */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 py-3 px-4">
                    <div className="text-white font-bold text-xl tracking-widest whitespace-nowrap"> {/* Removed pl-4 */}
                        ChronoShifter
                    </div>
                    {/* Right Side: Search Form Wrapper (simplified) */}
                    <div> {/* Removed pr-4, max-w-md, w-full */}
                        <SearchForm position="static" className="mb-0" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="col-span-12 space-y-8">
                        <Banner fetchedPlayer={profileData} />
                        <MatchList
                            puuid={profileData.playerInfo.puuid}
                            server={profileData.playerInfo.server}
                        />
                    </div>
                </div>
            </div>

            <SpeedInsights />
        </div>
    );
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: RouteParams;
}): Promise<Metadata> {
    const { server, name, tag } = await params;

    return {
        title: `${name.toUpperCase()}#${tag.toUpperCase()} - ChronoShifter`,
        description: `View ${name.toUpperCase()}#${tag.toUpperCase()}'s League of Legends profile stats and match history on the ${server} server`,
    };
}