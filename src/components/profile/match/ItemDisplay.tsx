import Image from "next/image";
import { getItemIcon } from "@/utils/leagueAssets";
import { BoxPlaceHolder } from "@/components/common";

function StandardItemDisplay({ items }: { items: number[] }) {
    return (
        <div className="flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={startIdx} className="flex gap-2">
                    {items.slice(startIdx, startIdx + 3).map((itemId, index) =>
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
                    )}
                </div>
            ))}
        </div>
    );
}

// Simplified ItemDisplay solely for standard items
export function ItemDisplay({
                                itemsIDs,
                            }: {
    itemsIDs: number[];
}) {
    return (
        <div className="w-full sm:w-auto">
            <StandardItemDisplay items={itemsIDs} />
        </div>
    );
}
