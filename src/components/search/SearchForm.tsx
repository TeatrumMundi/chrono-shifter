"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionSelector from "./RegionSelector";

export function SearchForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const server = formData.get("server") as string;
        const nickTag = formData.get("nickTag") as string;

        // Validate input
        if (!nickTag || !server) {
            setError("Please enter a summoner name and server");
            return;
        }

        // Parse summoner name and tag
        const parts = nickTag.split('#');
        const name = parts[0];
        const tag = parts[1] || '';

        if (!name || !tag) {
            setError("Please enter a valid RIOT ID gameName#TAG");
            return;
        }

        // Navigate to profile page
        router.push(`/${server}/${name}/${tag}`);
    };

    return (
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <RegionSelector />

                <input
                    type="text"
                    name="nickTag"
                    required
                    placeholder="NICKNAME#TAG"
                    className="flex-1 pl-2 pr-[50px] xs:pr-[60px] py-2 text-xs xs:pl-4 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-r-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-[.25em]"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={22}
                />

                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded p-2 aspect-square transition-all duration-200 ease-in-out hover:scale-105"
                >
                    <svg
                        className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </form>

            {error && (
                <div className="mt-2 p-2 bg-red-900/80 backdrop-blur-sm rounded text-white text-sm tracking-wide font-sans text-center">
                    {error}
                </div>
            )}
        </div>
    );
}