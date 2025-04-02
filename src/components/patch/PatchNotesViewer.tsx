"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AbilityChangeBlock {
    title: string;
    subtitle: string;
    items: string[];
}

interface ChampionChange {
    name: string;
    changes: AbilityChangeBlock[];
}

interface PatchSection {
    title: string;
    content: (string | ChampionChange)[];
}

interface PatchData {
    title: string;
    publishDate: string;
    sections: PatchSection[];
    sourceUrl?: string;
}

export function PatchNotesViewer({ patch }: { patch: PatchData }) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(patch.publishDate));

    const [authorSection, ...contentSections] = patch.sections;
    const author =
        !authorSection.title &&
        authorSection.content.length === 1 &&
        typeof authorSection.content[0] === "string"
            ? authorSection.content[0]
            : null;

    const defaultOpenTitles = ["champions", "bohaterowie", "campeones"];

    const [openSections, setOpenSections] = useState<Record<number, boolean>>(
        Object.fromEntries(
            contentSections.map((section, i) => [
                i,
                defaultOpenTitles.includes(section.title?.toLowerCase() ?? ""),
            ])
        )
    );

    const toggleSection = (index: number) => {
        setOpenSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const renderDecoratedText = (text: string) => {
        const decorated = text.replace(/\[NEW]/gi, '<NEW>').replace(/\[REMOVED]/gi, '<REMOVED>');
        const segments = decorated.split(/(<NEW>|<REMOVED>)/);

        return segments.map((seg, i) => {
            if (seg === "<NEW>") return <span key={`new-${i}`} className="text-green-400 font-bold">[NEW]</span>;
            if (seg === "<REMOVED>") return <span key={`removed-${i}`} className="text-red-400 font-bold">[REMOVED]</span>;
            return <span key={`seg-${i}`}>{seg}</span>;
        });
    };

    const renderSmartDiff = (text: string) => {
        const arrow = text.includes("➤") ? "➤" : text.includes("⇒") ? "⇒" : null;
        if (!arrow) return renderDecoratedText(text);

        const [before, after] = text.split(arrow).map((part) => part.trim());
        const extractNumbers = (s: string) => s.match(/[\d.]+/g)?.map(Number) || [];
        const beforeNumbers = extractNumbers(before);
        let beforeIndex = 0;

        const reconstructed = after.split(/([\d.]+)/).map((segment, i) => {
            const num = parseFloat(segment);
            if (!isNaN(num)) {
                const beforeVal = beforeNumbers[beforeIndex++];
                if (beforeVal === undefined) return segment;

                const diff = num - beforeVal;
                const color = diff > 0 ? "text-green-400 font-semibold" : diff < 0 ? "text-red-400 font-semibold" : "";

                return <span key={i} className={color} title={`${diff > 0 ? "+" : ""}${diff}`}>{segment}</span>;
            }
            return <span key={i}>{segment}</span>;
        });

        return (
            <>
                <span>{before}</span>
                <span className="font-bold text-cyan-400 px-2">{arrow}</span>
                <span>{reconstructed}</span>
            </>
        );
    };

    return (
        <div className="space-y-8">
            <header className="space-y-2 tracking-widest">
                <h1 className="text-3xl font-bold tracking-widest">{patch.title}</h1>
                <p className="text-amber-400 font-medium font-sans">Published on {formattedDate}</p>
                {author && <p className="text-gray-500 font-sans">By {author}</p>}
                {patch.sourceUrl && (
                    <a href={patch.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-sans">
                        View on official site
                    </a>
                )}
            </header>

            {contentSections.map((section, i) => (
                <div key={i} className="border border-slate-700 rounded-xl overflow-hidden font-sans">
                    <button
                        onClick={() => toggleSection(i)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors text-left"
                    >
                        <span className="text-lg font-semibold tracking-wide">
                            {section.title || "Untitled Section"}
                        </span>
                        {openSections[i] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className={`transition-all duration-300 px-6 py-4 space-y-3 bg-slate-900 ${openSections[i] ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                        {section.content.map((entry, j) => {
                            if (typeof entry === "string") {
                                return <p key={j} className="text-gray-200 leading-relaxed">{entry}</p>;
                            }

                            return (
                                <div key={j} className="border-l-4 border-slate-600 pl-4 space-y-3">
                                    <h3 className="text-lg font-medium text-white">{entry.name}</h3>
                                    {entry.changes.map((changeBlock, k) => (
                                        <div key={k} className="pl-4 border-l border-slate-700 space-y-1">
                                            <h4 className="text-white font-semibold">{changeBlock.subtitle}</h4>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                {changeBlock.items.map((item, m) => (
                                                    <li key={m}>{renderSmartDiff(item)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
