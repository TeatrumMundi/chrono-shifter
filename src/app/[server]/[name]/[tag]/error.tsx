"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchForm } from "@/components/search";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className="relative w-full h-screen overflow-hidden">
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

            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full max-w-2xl px-4">
                <div className="bg-red-900/70 rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[.20em] mb-2">
                        Error
                    </h2>
                    <p className="text-red-100 tracking-[.10em] font-sans">
                        Oops! Something went wrong while loading the profile.
                    </p>
                </div>
            </div>

            <SearchForm />

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
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
