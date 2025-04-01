"use client";

import { useState } from "react";

type PatchChange = {
    champion: string;
    changes: string[];
};

type PatchNotesProps = {
    patchVersion: string;
    changes: PatchChange[];
};

export default function PatchNotesViewer({ patchVersion, changes }: PatchNotesProps) {
    const [openChampion, setOpenChampion] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Patch {patchVersion}</h1>

            {changes.map((entry) => (
                <div
                    key={entry.champion}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                    <button
                        onClick={() =>
                            setOpenChampion(openChampion === entry.champion ? null : entry.champion)
                        }
                        className="w-full text-left font-semibold text-lg text-white hover:text-indigo-300 transition"
                    >
                        {entry.champion}
                    </button>

                    {openChampion === entry.champion && (
                        <ul className="mt-3 list-disc pl-6 text-sm text-gray-200 space-y-1">
                            {entry.changes.map((change, idx) => (
                                <li key={idx}>{change}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
