import { getRandomImage } from "@/utils/getRandomImage";
import * as Console from "node:console";

interface BackgroundProps {
    customUrl?: string; // Optional custom URL prop
}

export function Background({ customUrl }: BackgroundProps) {
    // Function to check if the URL is valid
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Check if customUrl is valid, otherwise use getRandomImage
    const backgroundImageUrl = customUrl && isValidUrl(customUrl)
        ? customUrl
        : getRandomImage(12);

    Console.log(`Using background image: ${backgroundImageUrl}`);

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