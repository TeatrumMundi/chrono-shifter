import {FormatResponseReturn, MatchResponse, ProcessedParticipant} from "@/types/interfaces";
import {getParticipantByPuuid, secToHHMMSS, timeAgo} from "@/utils/helper";

export function MatchList({ data, puuid }: { data: FormatResponseReturn; puuid: string }) {
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