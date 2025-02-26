"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
    const [name, setName] = useState("");
    const [server, setServer] = useState("");
    const [tag, setTag] = useState("");
    const router = useRouter();

    const regions = [
        { short: "na", long: "AMERICAS" },
        { short: "br", long: "AMERICAS" },
        { short: "lan", long: "AMERICAS" },
        { short: "las", long: "AMERICAS" },
        { short: "euw", long: "EUROPE" },
        { short: "eune", long: "EUROPE" },
        { short: "ru", long: "EUROPE" },
        { short: "tr", long: "EUROPE" },
        { short: "kr", long: "ASIA" },
        { short: "jp", long: "ASIA" },
        { short: "vn", long: "ASIA" },
        { short: "me", long: "ASIA" },
        { short: "oce", long: "SEA" },
        { short: "sea", long: "SEA" },
        { short: "tw", long: "SEA" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Redirect to the dynamic URL
        router.push(`/profile/?server=${server}&name=${name}&tag=${tag}`);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            {/* Name Input */}
            <div className="mb-4 text-sm font-medium text-gray-700">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your name"
                    required
                />
            </div>

            {/* Tag Input */}
            <div className="mb-4 text-sm font-medium text-gray-700">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                    Tag
                </label>
                <input
                    type="text"
                    id="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your tag"
                    required
                />
            </div>

            {/* Server Dropdown */}
            <div className="mb-4 text-sm font-medium text-gray-700">
                <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                    Server
                </label>
                <select
                    id="server"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="" disabled>
                        Select a server
                    </option>
                    {regions.map((region) => (
                        <option key={region.short} value={region.short}>
                            {region.short.toUpperCase()} - {region.long}
                        </option>
                    ))}
                </select>
            </div>



            {/* Submit Button */}
            <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Submit
            </button>
        </form>
    );
}