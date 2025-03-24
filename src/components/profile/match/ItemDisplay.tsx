import Image from "next/image";
import {getItemIcon} from "@/utils/leagueAssets";
import {BoxPlaceHolder} from "@/components/common";
import {ProcessedParticipant} from "@/types/interfaces";
import {AugmentDisplay} from "@/components/profile/arena/AugmentDisplay";

function StandardItemDisplay({ items }: { items: number[] }) {
    return (
        <div className="flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={startIdx} className="flex gap-2">
                    {items.slice(startIdx, startIdx + 3).map((itemId, index) => (
                        itemId > 0 ? (
                            <Image
                                key={`item-${startIdx}-${index}`}
                                src={getItemIcon(itemId)}
                                alt={`Item ${itemId}`}
                                width={32}
                                height={32}
                                className="rounded-md border border-gray-600"
                            />
                        ) : (
                            <BoxPlaceHolder key={`placeholder-${startIdx}-${index}`} />
                        )
                    ))}
                </div>
            ))}
        </div>
    );
}

// Combined display that conditionally shows augments for Arena mode
export function ItemDisplay({ itemsIDs, gameMode, participant }: {
    itemsIDs: number[];
    gameMode: string;
    participant: ProcessedParticipant;
}) {
    const augments =
        gameMode === "Arena" && participant.arenaData
            ? participant.arenaData.playerAugments
            : [];

    return (
        <div className="flex gap-4">
            {/* Standard Items Section */}
            <StandardItemDisplay items={itemsIDs} />

            {/* Augments Section - Only for Arena mode */}
            {gameMode === "Arena" && augments.length > 0 && (
                <AugmentDisplay augments={augments} />
            )}
        </div>
    );
}