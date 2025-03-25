"use client";

import React, { useActionState } from "react";
import RegionSelector from "./RegionSelector";
import {handleSearch} from "@/components/search/handleSearch";

const initialState = {
    error: null as string | null,
};

export default function SearchForm() {
    const [state, formAction, isPending] = useActionState(handleSearch, initialState);

    return (
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
            <form action={formAction} className="relative flex items-center">
                <div className="flex w-full">
                    <RegionSelector />

                    <input
                        type="text"
                        name="nickTag"
                        placeholder="NICKNAME#TAG"
                        className="flex-1 px-3 py-2 text-sm xs:text-base sm:text-lg md:text-xl bg-white/20 backdrop-blur-sm border-t border-b border-r border-white/30 rounded-r-lg focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-widest"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={22}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded p-1.5 aspect-square transition duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
                    aria-label="Search"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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

            <div className="mt-2 min-h-[2.5rem]">
                {state.error && (
                    <div className="p-2 bg-red-900/80 backdrop-blur-sm rounded text-white text-sm text-center tracking-widest">
                        {state.error}
                    </div>
                )}
            </div>
        </div>
    );
}
