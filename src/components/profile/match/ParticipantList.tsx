import {ProcessedParticipant} from "@/types/interfaces";
import {ArenaParticipantList} from "@/components/profile/arena/ArenaParticipantList";
import {ChampionIcon} from "@/components/profile/match/ChampionIcon";
import Link from "next/link";



export function ParticipantList({participants, gameMode, server}: {
    participants: ProcessedParticipant[];
    gameMode: string;
    server: string;
}) {
    if (gameMode === "Arena") {
        return <ArenaParticipantList participants={participants} server={server} />;
    }

    return <StandardParticipantList participants={participants} server={server} />;
}

function StandardParticipantList({participants, server}: { participants: ProcessedParticipant[]; server: string; })
{
    return (
        <div className="text-sm text-gray-400 tracking-normal h-full min-h-[your_desired_height]">
            <div className="flex flex-col gap-1 justify-between h-full">
                {participants.slice(0, 5).map((player, i) => (
                    <div key={i} className="flex w-full h-full min-h-[your_desired_height]">
                        <div className="flex items-center w-[49%] justify-end gap-1 bg-blue-900/50 p-2 rounded h-full">
                            <Link
                                href={`/${server}/${player.riotIdGameName}/${player.riotIdTagline}`}
                                className="truncate text-sm hover:text-blue-400 transition-colors"
                            >
                                {player.riotIdGameName}
                            </Link>
                            <ChampionIcon championName={player.championName} size={20} />
                        </div>
                        <span className="inline-block w-[2%]"></span>
                        <div className="flex items-center w-[49%] gap-1 bg-violet-950/50 p-2 rounded h-full">
                            <ChampionIcon championName={participants[i + 5]?.championName} size={20} />
                            {participants[i + 5] && (
                                <Link
                                    href={`/${server}/${participants[i + 5].riotIdGameName}/${participants[i + 5].riotIdTagline}`}
                                    className="truncate text-sm hover:text-blue-400 transition-colors"
                                >
                                    {participants[i + 5].riotIdGameName}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}