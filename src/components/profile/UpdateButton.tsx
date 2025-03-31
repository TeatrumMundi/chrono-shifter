"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

export default function UpdateButton({
                                         name,
                                         tag,
                                         server,
                                         onDone,
                                     }: {
    name: string;
    tag: string;
    server: string;
    onDone?: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleUpdateClick = () => {
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

    return (
        <button
            onClick={handleUpdateClick}
            className={`group relative flex items-center gap-2 px-5 py-2 rounded-sm text-sm font-semibold text-white tracking-widest transition-all duration-300 min-w-[130px] justify-center
        ${
                isPending
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg"
            }`}
            disabled={isPending}
            aria-live="polite"
        >
            {isSuccess ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <RotateCcw className={`w-4 h-4 ${isPending ? "animate-spin" : "group-hover:rotate-[-20deg] transition-transform"}`} />
            )}
            <span className="w-[90px] text-center">
        {isSuccess
            ? "Updated"
            : isPending
                ? "Updating..."
                : "Update"}
      </span>
        </button>
    );
}
