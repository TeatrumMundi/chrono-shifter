import { ProcessedParticipant } from "@/types/interfaces";
import { ArenaParticipantList } from "@/components/profile/arena/ArenaParticipantList";
import { ChampionIcon } from "@/components/profile/match/ChampionIcon";
import Link from "next/link";

/**
 * Renders a participant list based on the current game mode.
 */
export function ParticipantList({
                                    participants,
                                    gameMode,
                                    server,
                                }: {
    participants: ProcessedParticipant[];
    gameMode: string;
    server: string;
}) {
    if (gameMode === "Arena") {
        return (
            <ArenaParticipantList
                participants={participants}
                server={server}
            />
        );
    }

    return (
        <StandardParticipantList
            participants={participants}
            server={server}
        />
    );
}

/**
 * Renders a 5v5 standard participant list in two opposing columns.
 */
function StandardParticipantList({
                                     participants,
                                     server,
                                 }: {
    participants: ProcessedParticipant[];
    server: string;
}) {
    return (
        <div className="text-sm text-gray-400 tracking-normal h-full">
            <div className="flex flex-col gap-1 justify-between h-full">
                {participants.slice(0, 5).map((player, i) => {
                    const opponent = participants[i + 5];

                    return (
                        <ParticipantRow
                            key={player.puuid || `${player.riotIdGameName}-${i}`}
                            player={player}
                            opponent={opponent}
                            server={server}
                        />
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Reusable component for a single row displaying two players.
 */
function ParticipantRow({
                            player,
                            opponent,
                            server,
                        }: {
    player: ProcessedParticipant;
    opponent?: ProcessedParticipant;
    server: string;
}) {
    return (
        <div className="flex w-full min-h-[36px] items-center">
            {/* Left Player (Blue Team) */}
            <div className="flex items-center w-[49%] justify-end gap-1 bg-blue-900/50 p-2 rounded h-full transition-all duration-200 hover:bg-blue-900/70">
                <Link
                    href={`/${server}/${player.riotIdGameName}/${player.riotIdTagline}`}
                    className="truncate text-sm hover:text-blue-400 transition-colors"
                    title={`${player.riotIdGameName}#${player.riotIdTagline}`}
                    aria-label={`View profile for ${player.riotIdGameName}`}
                >
                    {player.riotIdGameName}
                </Link>
                <ChampionIcon championName={player.championName} size={20} />
            </div>

            <span className="inline-block w-[2%]" />

            {/* Right Player (Red Team) */}
            <div className="flex items-center w-[49%] gap-1 bg-violet-950/50 p-2 rounded h-full transition-all duration-200 hover:bg-violet-950/70">
                {opponent && (
                    <>
                        <ChampionIcon championName={opponent.championName} size={20} />
                        <Link
                            href={`/${server}/${opponent.riotIdGameName}/${opponent.riotIdTagline}`}
                            className="truncate text-sm hover:text-blue-400 transition-colors"
                            title={`${opponent.riotIdGameName}#${opponent.riotIdTagline}`}
                            aria-label={`View profile for ${opponent.riotIdGameName}`}
                        >
                            {opponent.riotIdGameName}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
