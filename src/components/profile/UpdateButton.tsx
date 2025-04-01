"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function UpdateButton({
                                         name,
                                         tag,
                                         server,
                                         lastUpdatedAt,
                                         onDone,
                                     }: {
    name: string;
    tag: string;
    server: string;
    lastUpdatedAt?: string; // ISO string
    onDone?: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleUpdateClick = async () => {
        try {
            await new Audio("/sounds/click.mp3").play();
        } catch (e) {
            console.warn("🔇 Failed to play click sound:", e);
        }
        startTransition(async () => {
            try {
                const res = await fetch("/api/force-update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, tag, server }),
                });

                if (!res.ok) {
                    toast.error("Update failed. Try again later.");
                    console.log(`❌ Update failed with status ${res.status}`);
                    return;
                }

                setIsSuccess(true);
                try {
                    await new Audio("/sounds/success.mp3").play();
                } catch (e) {
                    console.warn("🔇 Failed to play success sound:", e);
                }
                toast.success("Profile updated!");
                onDone?.();
                router.refresh();
            } catch (error) {
                toast.error("Unexpected error during update.");
                console.error("Update error:", error);
            } finally {
                setTimeout(() => setIsSuccess(false), 3000);
            }
        });
    };

    const updatedDate = lastUpdatedAt ? new Date(lastUpdatedAt) : null;
    const isOutdated =
        updatedDate && Date.now() - updatedDate.getTime() > 1000 * 60 * 60 * 24;
    const tooltip = updatedDate
        ? `Last updated ${formatDistanceToNow(updatedDate, {
            addSuffix: true,
        })}`
        : "No update info";

    const buttonColor = isPending
        ? "bg-gray-600 cursor-not-allowed"
        : isOutdated
            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";

    return (
        <div className="relative group">
            <button
                onClick={handleUpdateClick}
                className={`group relative flex items-center gap-2 px-5 py-2 rounded-sm text-sm font-semibold tracking-widest transition-all duration-300 min-w-[130px] justify-center shadow-lg ${buttonColor}`}
                disabled={isPending}
                aria-live="polite"
                title={tooltip}
            >
                {isSuccess ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : isOutdated ? (
                    <AlertTriangle className="w-4 h-4 text-black" />
                ) : (
                    <RotateCcw
                        className={`w-4 h-4 ${
                            isPending
                                ? "animate-spin"
                                : "group-hover:rotate-[-20deg] transition-transform"
                        }`}
                    />
                )}
                <span className="w-[90px] text-center transition-opacity duration-300 ease-in-out">
                    {isSuccess ? "Updated" : isPending ? "Updating..." : "Update"}
                </span>
            </button>
        </div>
    );
}
