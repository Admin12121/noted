import React from "react";
import { cn } from "@/lib/utils";

export default function DocumentSkeleton({ level = 0 }: { level?: number }) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-200 dark:bg-[#333] rounded-md h-12 py-2 flex items-center",
            )}
            style={{ marginLeft: `${level * 16}px`, minHeight: 40 }}
        >
            <div className="w-8 h-8 bg-gray-300 dark:bg-[#444] rounded-md mx-2" />
            <div className="h-4 bg-gray-300 dark:bg-[#444] rounded w-1/2" />
        </div>
    );
}