"use client";

import { ProcessedParticipant } from "@/types/interfaces";
import { motion } from "framer-motion";
import { Swords, Eye, Coins, Flame, BarChart3, Shield } from "lucide-react";
import { useState, useEffect, JSX } from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
    icon: JSX.Element;
    tooltip?: string;
    className?: string;
} | null;

export function MatchStats({
                               participant,
                               gameMode,
                           }: {
    participant: ProcessedParticipant;
    gameMode: string;
}) {
    const isArena = gameMode === "Arena";
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [formattedStats, setFormattedStats] = useState<StatItem[]>([]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            setIsOpen(!mobile); // Close on mobile, open otherwise
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const kda = parseFloat(participant.kda);
        let kdaColor = "text-yellow-500";
        if (kda >= 4) kdaColor = "text-green-500";
        else if (kda < 1) kdaColor = "text-red-500";

        const formatNumber = (n: number) =>
            new Intl.NumberFormat("en-US").format(n);

        const stats: StatItem[] = [
            {
                label: "KDA",
                value: (
                    <>
                        {participant.kills}/
                        <span className="text-red-500">{participant.deaths}</span>/
                        {participant.assists}{" "}
                        <span className={`ml-1 ${kdaColor}`}>({participant.kda})</span>
                    </>
                ),
                tooltip: "Kills / Deaths / Assists (KDA)",
                icon: <Swords className="w-3 h-3 text-muted-foreground shrink-0" />,
            },
            {
                label: "Damage",
                value: formatNumber(participant.damageDealt),
                tooltip: "Total damage dealt",
                icon: <Flame className="w-3 h-3 text-muted-foreground shrink-0" />,
            },
            {
                label: "Gold",
                value: formatNumber(participant.goldEarned),
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
                    label: "Wards",
                    value: participant.wardsPlaced.toString(),
                    tooltip: "Wards Placed",
                    icon: <Shield className="w-3 h-3 text-muted-foreground shrink-0" />, // Changed icon here
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

        setFormattedStats(stats);
    }, [participant, gameMode, isArena]);

    return (
        <div className="w-full">
            {isMobile && (
                <div className="mb-1 flex justify-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xs px-2 py-1 rounded-md border border-border bg-muted/40 hover:bg-muted transition-colors text-muted-foreground tracking-widest"
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
                    className="w-full grid gap-1 tracking-widest transition-all duration-300 grid-cols-1 xl:grid-cols-2 xl:grid-rows-3"
                >
                {formattedStats.map((stat, index) => {
                        if (!stat) return <div key={index} className="invisible h-0" />;

                        return (
                            <div
                                key={stat.label}
                                title={stat.tooltip}
                                className={`flex items-center justify-between px-2.5 py-1.5 text-[11px] border rounded-md bg-muted/40 dark:bg-zinc-800 transition-shadow hover:shadow-sm col-span-1`}
                            >
                                <div className="flex items-center gap-1 truncate text-muted-foreground">
                                    {stat.icon}
                                    <span className="truncate">{stat.label}</span>
                                </div>
                                <span
                                    className={`text-right font-medium truncate text-foreground ${
                                        stat.className ?? ""
                                    }`}
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