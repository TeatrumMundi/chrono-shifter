"use client";

import React, { useState, useEffect, useActionState, useMemo } from "react";
import { handleSearch } from "@/components/common/search/handleSearch";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import debounce from "lodash.debounce";

const initialState = {
    error: null as string | null,
};

type RegionSelectorProps = {
    onChange: (region: string) => void;
    isDropdownOpen: boolean;
};

type Suggestion = {
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
};

const cache = new Map<string, Suggestion[]>();

function saveRecentSearch(profile: Suggestion) {
    const key = "recent_searches";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [profile, ...existing.filter((p: Suggestion) => `${p.gameName}#${p.tagLine}` !== `${profile.gameName}#${profile.tagLine}`)];
    localStorage.setItem(key, JSON.stringify(updated.slice(0, 3)));
}

function getRecentSearches(): Suggestion[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem("recent_searches") || "[]");
    } catch {
        return [];
    }
}

function RegionSelector({ onChange, isDropdownOpen}: RegionSelectorProps) {
    return (
        <select
            name="server"
            defaultValue="EUNE"
            className={`h-full pl-2 pr-6 py-2 text-xs xs:pl-3 xs:pr-8 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl 
            bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 
            text-white appearance-none tracking-[0.2em] transition-all duration-200 
                rounded-tl-lg ${isDropdownOpen ? "rounded-bl-none" : "rounded-bl-lg"}`}
            autoComplete="off"
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="REGION" disabled className="bg-blue-800/20 backdrop-blur-sm tracking-[0.2em]">REGION</option>
            <option value="NA" className="bg-blue-900/50">NA</option>
            <option value="EUW" className="bg-indigo-800/50">EUW</option>
            <option value="EUNE" className="bg-indigo-900/50">EUNE</option>
            <option value="KR" className="bg-purple-800/50">KR</option>
            <option value="BR" className="bg-purple-900/50">BR</option>
            <option value="JP" className="bg-pink-800/50">JP</option>
            <option value="RU" className="bg-pink-900/50">RU</option>
            <option value="OCE" className="bg-teal-800/50">OCE</option>
            <option value="TR" className="bg-teal-900/50">TR</option>
            <option value="LAN" className="bg-rose-800/50">LAN</option>
            <option value="LAS" className="bg-rose-900/50">LAS</option>
            <option value="SEA" className="bg-cyan-800/50">SEA</option>
            <option value="TW" className="bg-cyan-900/50">TW</option>
            <option value="VN" className="bg-emerald-800/50">VN</option>
            <option value="ME" className="bg-emerald-900/50">ME</option>
        </select>
    );
}

type SearchFormProps = {
    position?: "centered" | "static";
    className?: string;
};

export default function SearchForm({ position = "centered", className }: SearchFormProps) {
    const [state, formAction, isPending] = useActionState(handleSearch, initialState);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<Suggestion[]>([]);
    const [query, setQuery] = useState<string>("");
    const [region, setRegion] = useState("eune");
    const [inputFocused, setInputFocused] = useState(false);

    const shouldShowDropdown = inputFocused && (suggestions.length > 0 || recentSearches.length > 0);

    const fetchSuggestions = useMemo(() =>
        debounce(async (query: string, region: string) => {
            const cacheKey = `${region}_${query}`;
            if (cache.has(cacheKey)) {
                setSuggestions(cache.get(cacheKey)!);
                return;
            }

            try {
                const res = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}&region=${region}`);
                const data: Suggestion[] = await res.json();
                cache.set(cacheKey, data);
                setSuggestions(data);
            } catch (err) {
                console.error("❌ Failed to fetch suggestions:", err);
            }
        }, 500), []);

    useEffect(() => {
        if (query.length > 0) {
            void fetchSuggestions(query, region);
        } else {
            setSuggestions([]);
        }

        return () => {
            fetchSuggestions.cancel();
        };
    }, [query, region, fetchSuggestions]);

    return (
        <div className={`w-full max-w-3xl px-4 ${position === "centered"
            ? "absolute top-6/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            : `mx-auto ${className ?? "mb-4"}`}`}>
            <form action={formAction} className="relative flex items-center">
                <div className="flex w-full relative shadow-md transition-shadow duration-200">
                    <div className={`rounded-tl-lg ${shouldShowDropdown ? "rounded-bl-none" : "rounded-bl-lg"}`}>
                        <RegionSelector onChange={setRegion} isDropdownOpen={shouldShowDropdown} />
                    </div>

                    <input
                        type="text"
                        name="nickTag"
                        placeholder="NICKNAME#TAG"
                        className={`flex-1 px-3 py-2 text-sm xs:text-base sm:text-lg md:text-xl 
                        bg-white/20 backdrop-blur-sm border-t border-b border-r border-white/30 
                        ${shouldShowDropdown ? "rounded-tr-lg rounded-br-none" : "rounded-r-lg"} 
                        focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-widest transition-all duration-200`}
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={22}
                        required
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            setInputFocused(true);
                            if (query.length <= 1) {
                                setRecentSearches(getRecentSearches());
                            }
                        }}
                        onBlur={() => setTimeout(() => setInputFocused(false), 100)}
                        value={query}
                    />

                    <AnimatePresence>
                        {shouldShowDropdown && (
                            <motion.ul
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute top-full left-0 right-0 bg-white/10 backdrop-blur-sm border border-white/30
                                rounded-b-lg text-white text-sm md:text-base max-h-60 overflow-y-auto shadow-lg w-full`}
                            >
                                {suggestions.map((s, i) => (
                                    <li
                                        key={`suggestion-${i}`}
                                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/20 transition-all tracking-widest"
                                        onMouseDown={() => {
                                            setQuery(`${s.gameName}#${s.tagLine}`);
                                            setSuggestions([]);
                                            saveRecentSearch(s);
                                        }}
                                    >
                                        <Image
                                            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${s.profileIconId}.jpg`}
                                            alt={`${s.gameName} icon`}
                                            width={24}
                                            height={24}
                                            className="rounded-md"
                                            quality={40}
                                            loading="eager"
                                        />
                                        <span className="flex-1">{s.gameName}#{s.tagLine}</span>
                                        <span className="text-xs text-white/60">lvl {s.summonerLevel}</span>
                                    </li>
                                ))}

                                {(() => {
                                    const filteredRecent = recentSearches.filter(
                                        r => !suggestions.some(s => s.gameName === r.gameName && s.tagLine === r.tagLine)
                                    );
                                    if (filteredRecent.length === 0) return null;

                                    return (
                                        <>
                                            <li className="px-4 py-1 text-xs uppercase tracking-wider text-white/50">Recently searched</li>
                                            {filteredRecent.map((s, i) => (
                                                <li
                                                    key={`recent-${i}`}
                                                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/20 transition-all tracking-widest"
                                                    onMouseDown={() => {
                                                        setQuery(`${s.gameName}#${s.tagLine}`);
                                                        setSuggestions([]);
                                                        saveRecentSearch(s);
                                                    }}
                                                >
                                                    <Image
                                                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${s.profileIconId}.jpg`}
                                                        alt={`${s.gameName} icon`}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-md"
                                                        quality={40}
                                                        loading="eager"
                                                    />
                                                    <span className="flex-1">{s.gameName}#{s.tagLine}</span>
                                                    <span className="text-xs text-white/60">lvl {s.summonerLevel}</span>
                                                </li>
                                            ))}
                                        </>
                                    );
                                })()}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30
                    rounded p-1.5 aspect-square transition duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
                    aria-label="Search"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {state.error && (
                <div className="mt-2">
                    <div className="p-2 bg-red-900/80 backdrop-blur-sm rounded text-white text-sm text-center tracking-widest">
                        {state.error}
                    </div>
                </div>
            )}
        </div>
    );
}