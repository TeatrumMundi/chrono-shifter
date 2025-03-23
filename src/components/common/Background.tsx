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
    const backgroundImageUrl = useMemo(() => {
        return customUrl && isValidUrl(customUrl) ? customUrl : getRandomImage(12);
    }, [customUrl]);

    const isValid: boolean = isValidUrl(backgroundImageUrl);

    return (
        <div className="fixed inset-0 min-h-screen -z-10">
            {isValid ? (
                <Image
                    src={backgroundImageUrl}
                    alt="Background"
                    fill
                    priority
                    quality={75}
                    className="object-cover"
                />
            ) : (
                <div
                    className="bg-cover bg-center bg-no-repeat min-h-screen"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                />
            )}
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
