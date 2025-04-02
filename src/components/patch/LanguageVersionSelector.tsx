"use client";

import { useRouter } from "next/navigation";

interface Props {
    currentLanguage: string;
    currentVersion: string;
    allLanguages: string[];
    allVersions: string[];
}

export default function LanguageVersionSelector({currentLanguage, currentVersion, allLanguages, allVersions,}: Props) {
    const router = useRouter();

    return (
        <div className="flex flex-wrap gap-4 font-sans">
            <select
                className="bg-slate-800 border border-slate-700 rounded px-4 py-2"
                defaultValue={currentLanguage}
                onChange={(e) =>
                    router.push(`/patch/${e.target.value}/${currentVersion}`)
                }
            >
                {allLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                        {lang}
                    </option>
                ))}
            </select>

            <select
                className="bg-slate-800 border border-slate-700 rounded px-4 py-2"
                defaultValue={currentVersion}
                onChange={(e) =>
                    router.push(`/patch/${currentLanguage}/${e.target.value}`)
                }
            >
                {allVersions.map((ver) => (
                    <option key={ver} value={ver}>
                        {ver}
                    </option>
                ))}
            </select>
        </div>
    );
}
