import Image from "next/image";

export function RuneDisplay({ primaryRuneUrl, runePathUrl }: { primaryRuneUrl: string; runePathUrl: string }) {
    if (!primaryRuneUrl && !runePathUrl) return null;

    return (
        <div className="flex flex-col items-center bg-gray-800 rounded-2xl p-1 border border-gray-600">
            {primaryRuneUrl && (
                <Image
                    src={primaryRuneUrl}
                    alt="Primary Rune"
                    width={31}
                    height={31}
                    className="rounded-full"
                />
            )}
            {runePathUrl && (
                <Image
                    src={runePathUrl}
                    alt="Rune Path"
                    width={20}
                    height={20}
                    className="rounded-full mt-3.5"
                />
            )}
        </div>
    );
}