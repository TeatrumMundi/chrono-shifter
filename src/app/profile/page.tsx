import {getSummonerProfile} from "@/app/apiiHandler/getSummonerProfile";
import {getParticipantByPuuid, secToHHMMSS, timeAgo} from "@/app/apiiHandler/helper";
import {Banner} from "@/app/profile/banner";
import {Background} from "@/app/profile/background";

async function fetchData(server: string, name: string, tag: string) {
    if (!server || !name || !tag) return null;
    return getSummonerProfile(server, name, tag);
}

// Change the type to use a Record<string, string | string[] | undefined>
export default async function Home({searchParams}: { searchParams: Record<string, string | string[] | undefined> })
{
    // Extract the parameters from searchParams
    const server = searchParams.server as string;
    const name = searchParams.name as string;
    const tag = searchParams.tag as string;

    // Fetch data using the extracted parameters
    const data = await fetchData(server, name, tag);

    if (!data) return <h2>No data available</h2>;

    const mainPlayerMatches = data.match
        .map(match => getParticipantByPuuid(match, data.puuid))
        .filter((participant) => participant !== null);

    if (mainPlayerMatches.length === 0) return <h2>No match data found for this player.</h2>;

    return (
        <div className="relative">
            <Background />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-12 gap-4 mt-16">
                    <div className="col-span-12">
                        <Banner data={data} />
                        <h3 className="mt-6 border-b border-gray-700 pb-2 font-sans">Recent Matches:</h3>
                        {mainPlayerMatches.map((participant, index) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
}
