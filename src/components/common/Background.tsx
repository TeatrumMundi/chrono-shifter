import Image from 'next/image';

interface BackgroundProps {
    customUrl?: string;
}

function getRandomImage(max_number: number): string {
    const randomNumber = Math.floor(Math.random() * (max_number-1)) + 1;
    return `/main/${randomNumber}.jpg`;
}

export function Background({ customUrl }: BackgroundProps) {

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Determine the background image URL
    const backgroundImageUrl = customUrl && isValidUrl(customUrl)
        ? customUrl
        : getRandomImage(12);

    return (
        <div className="fixed inset-0 min-h-screen -z-10">
            {isValidUrl(backgroundImageUrl) ? (
                <Image
                    src={backgroundImageUrl}
                    alt="Background"
                    fill
                    priority={true}
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