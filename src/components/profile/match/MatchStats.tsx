import {ProcessedParticipant} from "@/types/interfaces";
import {MatchDetail} from "@/components/profile/match/MatchDetail";

export function MatchStats({ participant, gameMode }: { participant: ProcessedParticipant; gameMode: string; }) {
    // Common stats for all game modes
    const commonStats = (
        <>
            <MatchDetail
                label="KDA"
                value={`${participant.kills}/${participant.deaths}/${participant.assists} (${participant.kda})`}
            />
            {participant.teamPosition && (
                <MatchDetail label="Role" value={participant.teamPosition} />
            )}
            <MatchDetail label="Damage" value={participant.damageDealt.toString()} />
            <MatchDetail label="Gold Earned" value={participant.goldEarned.toString()} />
        </>
    );

    // Additional stats for standard game modes
    if (gameMode !== "Arena") {
        return (
            <>
                {commonStats}
                <MatchDetail label="Vision Score" value={participant.visionScore.toString()} />
                <MatchDetail
                    label="Minions"
                    value={`${participant.minionsKilled} (${participant.minionsPerMinute})`}
                />
            </>
        );
    }

    // Just return common stats for Arena mode
    return commonStats;
}