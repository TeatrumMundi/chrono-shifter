import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { PatchNotesViewer } from "@/components/patch/PatchNotesViewer";
import LanguageVersionSelector from "@/components/patch/LanguageVersionSelector";
import {headers} from "next/headers";

export const dynamic = "force-dynamic";

export default async function PatchPage({params,}: { params: Promise<{ language: string; version: string }>; }) {
    const { language, version } = await params;

    let patchData = null;

    try {
        const host = (await headers()).get("host");
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const url = `${protocol}://${host}/api/patch/${language}/${version}`;

        const res = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            console.warn(`⚠️ Patch not found: ${language}/${version}`);
            return notFound();
        }

        patchData = await res.json();
    } catch (err) {
        console.error("❌ Failed to fetch patch:", err);
        return notFound();
    }

    const allLanguages = ["en-US", "pl-PL", "de-DE"];
    const allVersions = [
        "25-07",
        "25-06",
        "25-05",
        "25-04",
        "2025-s1-3",
        "25-s1-2",
        "25-s1-1",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <LanguageVersionSelector
                    currentLanguage={language}
                    currentVersion={version}
                    allLanguages={allLanguages}
                    allVersions={allVersions}
                />
                <PatchNotesViewer patch={patchData} />
            </main>
        </div>
    );
}
