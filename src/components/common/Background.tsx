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
    const backgroundImageUrl = useMemo<string>(() => {
        if (customUrl && isValidUrl(customUrl)) {
            return customUrl;
        }
        return getRandomImage(12);
    }, [customUrl]);

    return (
        <div className="fixed inset-0 min-h-screen -z-10">
            <Image
                src={backgroundImageUrl}
                alt="Background"
                fill
                priority={true}
                quality={100}
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
