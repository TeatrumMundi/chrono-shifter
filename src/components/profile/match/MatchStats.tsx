"use client";

import { ProcessedParticipant } from "@/types/interfaces";
import { motion } from "framer-motion";
import {
    Swords,
    Eye,
    Coins,
    Flame,
    BarChart3,
} from "lucide-react";
import {useState, useEffect, JSX} from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
    icon: JSX.Element;
    tooltip?: string;
    className?: string;
} | null;

export function MatchStats({ participant, gameMode }: { participant: ProcessedParticipant; gameMode: string }) {
    const isArena = gameMode === "Arena";
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const kda = parseFloat(participant.kda);
    let kdaColor = "text-yellow-500";
    if (kda >= 4) kdaColor = "text-green-500";
    else if (kda < 1) kdaColor = "text-red-500";

    const stats: StatItem[] = [
        {
            label: "KDA",
            value: (
                <>
                    {participant.kills}/
                    <span className="text-red-500">{participant.deaths}</span>/
                    {participant.assists} <span className={`ml-1 ${kdaColor}`}>({participant.kda})</span>
                </>
            ),
            tooltip: "Kills / Deaths / Assists (KDA)",
            icon: <Swords className="w-3 h-3 text-muted-foreground shrink-0" />,
        },
        {
            label: "Damage",
            value: participant.damageDealt.toLocaleString(),
            tooltip: "Total damage dealt",
            icon: <Flame className="w-3 h-3 text-muted-foreground shrink-0" />,
        },
        {
            label: "Gold",
            value: participant.goldEarned.toLocaleString(),
            tooltip: "Gold earned in the match",
            icon: <Coins className="w-3 h-3 text-muted-foreground shrink-0" />,
        },
    ];

    if (!isArena) {
        const minionsPerMinute = parseFloat(participant.minionsPerMinute);

        stats.push(
            {
                label: "Vision",
                value: participant.visionScore.toString(),
                tooltip: "Vision Score",
                icon: <Eye className="w-3 h-3 text-muted-foreground shrink-0" />,
            },
            {
                label: "Minions",
                value: `${participant.minionsKilled} (${participant.minionsPerMinute})`,
                tooltip: "Minions killed (and per minute)",
                icon: <BarChart3 className="w-3 h-3 text-muted-foreground shrink-0" />,
                className: minionsPerMinute > 8 ? "text-green-500 font-semibold" : "",
            }
        );
    }

    return (
        <div className="w-full">
            {isMobile && (
                <div className="mb-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xs text-muted-foreground underline"
                    >
                        {isOpen ? "Hide stats" : "Show stats"}
                    </button>
                </div>
            )}

            {(isOpen || !isMobile) && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-2"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
                    }}
                >
                    {stats.map((stat, index) => {
                        if (!stat) return <div key={index} className="invisible h-0" />;

                        const isMinions = stat.label === "Minions";

                        return (
                            <div
                                key={stat.label}
                                title={stat.tooltip}
                                className={`flex items-center justify-between px-2.5 py-1.5 text-[11px] border rounded-md bg-muted/40 dark:bg-zinc-800 transition-shadow hover:shadow-sm ${
                                    isMinions ? "col-span-2" : ""
                                }`}
                            >
                                <div className="flex items-center gap-1 truncate text-muted-foreground">
                                    {stat.icon}
                                    <span className="truncate">{stat.label}</span>
                                </div>
                                <span
                                    className={`text-right font-medium truncate text-foreground ${stat.className ?? ""}`}
                                >
                                    {stat.value}
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}