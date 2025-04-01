"use client";

import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/common/search/SearchForm";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden px-4 py-10">
            {/* Tło */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <Image
                    src="/main/5.jpg"
                    alt="Background"
                    fill
                    quality={75}
                    className="object-cover"
                    priority
                />
            </div>

            {/* Komunikat */}
            <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-red-900/70 rounded-lg p-4 md:p-6 shadow-lg text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[.20em] mb-2">
                        Error
                    </h2>
                    <p className="text-red-100 tracking-[.10em] font-sans">
                        Oops! Something went wrong while loading the profile.
                    </p>
                </div>
            </div>

            {/* Obrazek */}
            <div className="max-w-md mx-auto mb-6">
                <Image
                    src="/responseCodes/error_404.png"
                    alt="Error 404"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-md mx-auto"
                    priority
                />
            </div>

            {/* SearchForm */}
            <div className="max-w-md mx-auto mb-10">
                <SearchForm />
            </div>

            {/* Przyciski */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors duration-200 tracking-[.25em]"
                >
                    Try Again
                </button>

                <Link
                    href="/"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 tracking-[.25em]"
                >
                    Return to Home Page
                </Link>
            </div>
        </div>
    );
}
