import { getRandomImage } from "@/utils/getRandomImage";

interface BackgroundProps {
    customUrl?: string; // Optional custom URL prop
}

export function Background({ customUrl }: BackgroundProps) {
    // Use the custom URL if provided, otherwise fall back to getRandomImage
    const backgroundImageUrl = customUrl || getRandomImage(12);

    return (
        <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat min-h-screen text-white overflow-hidden -z-10"
            style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                height: "100vh",
                minHeight: "450px",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>
        </div>
    );
}