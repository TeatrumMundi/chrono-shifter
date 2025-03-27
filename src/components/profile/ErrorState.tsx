import Link from "next/link";
import { SearchForm } from "@/components/search";
import { Background } from "@/components/common";

export function ErrorState({ message }: { message: string }) {
    return (
        <div className="container mx-auto px-4 py-8 mt-8 md:mt-16 text-center">
            <Background splashUrl="/main/5.jpg" quality={75} />
            <div className="bg-red-900/70 rounded-lg p-4 md:p-8 shadow-lg mb-4 md:mb-8 max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-[.20em]">Error</h2>
                <p className="text-red-100 tracking-[.10em] font-sans">{message}</p>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-12 tracking-[.25em] bg-white/10 px-4 py-2 rounded-lg inline-block">
                    Try searching for another summoner:
                </h3>

                <div className="w-full">
                    <SearchForm />
                </div>

                {/* Add more margin-top to the button container */}
                <div className="mt-20 inline-block"> {/* Increased margin-top from mt-16 to mt-20 */}
                    <Link
                        href="/"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 tracking-[.25em]"
                    >
                        Return to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}