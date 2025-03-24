import { useMemo } from "react";
import Image from "next/image";

interface BackgroundProps {
    customUrl?: string;
}

function getRandomImage(maxNumber: number): string {
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    return `/main/${randomNumber}.jpg`;
}

export function Background({ customUrl }: BackgroundProps) {
    const backgroundImageUrl = useMemo<string | undefined>(() => {
        if (customUrl && isValidUrl(customUrl)) {
            return customUrl;
        }
        const randomImage = getRandomImage(12);
        return isValidUrl(randomImage) ? randomImage : undefined;
    }, [customUrl]);

    if (!backgroundImageUrl) {
        console.error("No valid background image URL available.");
        return <div className="fixed inset-0 min-h-screen -z-10 bg-gray-800" />;
    }

    return (
        <div className="fixed inset-0 min-h-screen -z-10">
            <Image
                src={backgroundImageUrl}
                alt="Background"
                fill
                priority
                quality={75}
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>
        </div>
    );
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
